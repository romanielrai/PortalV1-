import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role.name },
    process.env.JWT_SECRET ?? 'secret',
    { expiresIn: '7d' }
  );

  return res.json({ token, user: { id: user.id, email: user.email, role: user.role.name } });
});

router.post('/register', async (req, res) => {
  const { email, password, name, roleName } = req.body;
  if (!email || !password || !roleName) return res.status(400).json({ error: 'Missing fields' });
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return res.status(400).json({ error: 'Invalid role' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash, roleId: role.id }
  });
  return res.json({ user: { id: user.id, email: user.email, role: role.name } });
});

export default router;
