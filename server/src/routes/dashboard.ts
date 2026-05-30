import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const [leadCount, appointmentCount, callCount, recoveredLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.appointment.count(),
    prisma.call.count(),
    prisma.lead.count({ where: { status: 'CONTACTED' } })
  ]);

  return res.json({
    metrics: {
      leadsGenerated: leadCount,
      appointmentsBooked: appointmentCount,
      callsAnswered: callCount,
      recoveredLeads
    }
  });
});

export default router;
