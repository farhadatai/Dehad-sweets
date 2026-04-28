
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: jwt.JwtPayload & { id?: string; role?: string; storeId?: string };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id?: string; role: string; storeId?: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role?.toUpperCase() !== 'ADMIN') {
    return res.status(403).send({ error: 'Access denied.' });
  }
  next();
};

export default auth;
