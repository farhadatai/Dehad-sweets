
import { Response, NextFunction } from 'express';
import { Request } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role.toUpperCase())) {
      return res.status(403).send({ error: 'Access denied.' });
    }
    next();
  };
};

export default authorize;
