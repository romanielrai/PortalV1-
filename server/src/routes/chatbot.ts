import { Router } from 'express';
import { OpenAI } from 'openai';
import { prisma } from '../prisma';

const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const serviceContext = `AI Growth Systems provides enterprise AI receptionist, missed call recovery, lead reactivation, and appointment setter services. Pricing packages include Starter, Growth, and Dominance tiers with guarantees for live setup, qualified appointments, revenue recovery, and ROI. The AI assistant should act as a high-ticket sales representative, qualify leads, book appointments, and support objections.`;

router.post('/conversation', async (req, res) => {
  const { sessionId, messages, lead, clientId } = req.body;
  const prompt = `${serviceContext}\nUser context: ${JSON.stringify({ lead, clientId })}`;
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: prompt },
      ...(messages ?? [])
    ],
    temperature: 0.18,
    max_tokens: 600
  });

  const answer = response.choices?.[0]?.message?.content ?? 'I am here to assist with pricing and scheduling.';

  await prisma.chatbotLog.create({
    data: {
      sessionId: sessionId ?? 'session-unknown',
      role: 'assistant',
      message: answer,
      metadata: { source: 'openai' }
    }
  });

  res.json({ answer });
});

export default router;
