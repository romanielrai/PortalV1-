import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', async (req: AuthRequest, res) => {
  const { name, email, phone, business, source, clientId } = req.body;
  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      business,
      source,
      status: 'NEW',
      client: { connect: { id: clientId } }
    }
  });
  return res.json({ lead });
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const clientId = req.query.clientId as string | undefined;
  const filter = clientId ? { clientId } : {};
  const leads = await prisma.lead.findMany({ where: filter, orderBy: { createdAt: 'desc' } });
  return res.json({ leads });
});

export default router;
