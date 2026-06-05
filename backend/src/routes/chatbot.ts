import { Router } from 'express';
import { OpenAI } from 'openai';
import { prisma } from '../prisma';
import { getConfigs } from '../config-store';

const router = Router();

router.post('/conversation', async (req, res) => {
  try {
    const { sessionId, messages } = req.body;
    let answer = '';

    const configs = getConfigs();
    const activeOpenaiKey = configs.openaiApiKey;
    
    // Check if real key is present
    const isRealKey = activeOpenaiKey && 
                      activeOpenaiKey !== 'your-openai-api-key' && 
                      activeOpenaiKey !== 'sk-your-openai-api-key-here' &&
                      activeOpenaiKey !== 'mock-key' &&
                      activeOpenaiKey.trim().length > 0;

    if (isRealKey) {
      try {
        const client = new OpenAI({ apiKey: activeOpenaiKey });
        const formattedMessages = (messages ?? []).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content || ''
        }));
        const response = await client.chat.completions.create({
          model: configs.openaiModel || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: configs.systemPrompt },
            ...formattedMessages
          ],
          temperature: configs.openaiTemperature ?? 0.3,
          max_tokens: 250
        });
        answer = response.choices?.[0]?.message?.content ?? '';
      } catch (error) {
        console.error('[OpenAI Error] API call failed, falling back to simulation:', error);
      }
    }

    // ── Simulation mode: company-scripted responses ──
    if (!answer) {
      const last = [...(messages ?? [])].reverse().find(m => m.role === 'user')?.text?.toLowerCase() ?? '';

      // Check if matches any custom Q&A from trained knowledge base
      const matchedKB = (configs.kbEntries || []).find(entry => 
        last.includes(entry.q.toLowerCase()) || entry.q.toLowerCase().includes(last)
      );

      if (matchedKB) {
        answer = matchedKB.a;
      } else if (last.includes('price') || last.includes('cost') || last.includes('pricing') || last.includes('tier') || last.includes('package') || last.includes('plan')) {
        answer = `We have three packages designed for real ROI. The Starter at 1,497 dollars per month gives you a 24/7 AI receptionist with custom scripts and weekly reports. The Growth plan at 2,997 dollars adds missed call recovery, CRM integration, and bi-weekly strategy calls — this is our most popular. And the Dominance plan at 5,997 dollars includes everything, plus dead lead reactivation and a dedicated success manager. Most clients see a return within 30 days. Which sounds like the right fit for your business?`;

      } else if (last.includes('guarantee') || last.includes('roi') || last.includes('result') || last.includes('work') || last.includes('worth')) {
        answer = `Every client gets a live AI agent setup within 48 hours, missed calls recovered in under 10 seconds, and a full ROI reporting dashboard so you can see exactly what the system is generating. We've helped service businesses recover thousands in lost revenue every single month. Would you like to see a demo tailored to your industry?`;

      } else if (last.includes('book') || last.includes('schedule') || last.includes('demo') || last.includes('consult') || last.includes('appointment') || last.includes('call')) {
        answer = `Absolutely, I'd love to get you booked in. Our team will design a custom AI workflow for your specific business. Just click the Book Demo button at the top of the page and pick a time that suits you. The session is 30 minutes on Zoom and completely free. What industry are you in? That helps us prepare the right demo for you.`;

      } else if (last.includes('miss') || last.includes('call recovery') || last.includes('missed call')) {
        answer = `Our Missed Call Recovery system sends an automatic text back to any missed caller within 10 seconds. The AI then continues the conversation, qualifies the lead, and books them while you're busy. For most businesses, this alone recovers 15 to 30 percent of lost leads every month. Is missed call recovery something you're currently struggling with?`;

      } else if (last.includes('reactivat') || last.includes('dead lead') || last.includes('old lead') || last.includes('cold')) {
        answer = `Our Dead Lead Reactivation campaigns use AI-written email and SMS sequences to re-engage contacts who went cold. Most businesses recover between 5,000 and 20,000 dollars in pipeline per campaign. We handle the copywriting, the scheduling, and the lead scoring — all done for you. How large is your current inactive contact list?`;

      } else if (last.includes('receptionist') || last.includes('inbound') || last.includes('answer') || last.includes('phone')) {
        answer = `Our AI Receptionist answers every inbound call, 24 hours a day, 7 days a week — including after hours, weekends, and holidays. It uses a custom script trained on your services, qualifies the caller, books appointments straight into your calendar, and sends you a weekly performance report. Most clients go live within 48 hours. Would you like to see a live call demo?`;

      } else if (last.includes('hello') || last.includes('hi') || last.includes('hey') || last.includes('start') || last === '') {
        answer = `Hello, welcome to AI Growth Systems! I'm your AI growth consultant. I can walk you through our pricing, explain how our AI receptionist and missed call recovery works, or help you book a free consultation. What brings you here today?`;

      } else {
        answer = `Thanks for reaching out! AI Growth Systems specialises in AI receptionists, missed call recovery, and lead reactivation for service businesses. Could you tell me a bit more about what you're looking to solve? Or I can book you a free 30-minute strategy call with our team right now.`;
      }
    }

    await prisma.chatbotLog.create({
      data: {
        sessionId: sessionId ?? 'session-unknown',
        role: 'assistant',
        message: answer,
        metadata: JSON.stringify({ source: isRealKey ? 'openai' : 'simulation' })
      }
    });

    res.json({ answer });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'An error occurred processing your message' });
  }
});

export default router;
