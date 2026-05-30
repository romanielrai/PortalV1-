import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
    if (typeof payload === 'object' && payload !== null && 'id' in payload) {
      req.user = {
        id: payload.id as string,
        role: payload.role as string,
        email: payload.email as string
      };
      return next();
    }

    return res.status(401).json({ error: 'Invalid token payload' });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export async function requireRole(role: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: true }
    });
    if (!user || user.role.name !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}
