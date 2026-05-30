import { Router } from 'express';
import twilio from 'twilio';
import { prisma } from '../prisma';

const router = Router();
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

if (!twilioAccountSid || !twilioAuthToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be defined');
}

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

router.post('/call', async (req, res) => {
  const { to, from, clientId, leadId } = req.body;
  if (!to || !from) {
    return res.status(400).json({ error: 'Both to and from numbers are required' });
  }

  const call = await twilioClient.calls.create({
    url: process.env.TWILIO_CALLBACK_URL ?? 'http://demo.twilio.com/docs/voice.xml',
    to,
    from
  });

  await prisma.call.create({
    data: {
      client: { connect: { id: clientId } },
      lead: leadId ? { connect: { id: leadId } } : undefined,
      initiatedBy: 'system',
      durationSec: 0,
      outcome: 'initiated'
    }
  });

  res.json({ sid: call.sid, status: call.status });
});

export default router;
