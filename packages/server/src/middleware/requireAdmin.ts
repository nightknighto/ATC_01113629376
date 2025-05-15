import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@events-platform/shared';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, error: 'Admins only' });
    }
    next();
};
