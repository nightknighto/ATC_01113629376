import type { USER_ROLE } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { JwtService } from '../services';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: USER_ROLE; // Add role to request type
            };
        }
    }
}

const authenticate = (isRequired = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            // If no auth header and auth is optional, continue
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                if (!isRequired) {
                    return next();
                }
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authHeader.split(' ')[1];

            try {
                const user = JwtService.verifyToken(token);

                if (!user) {
                    if (!isRequired) {
                        return next();
                    }
                    return res.status(404).json({ error: 'User not found' });
                }

                // Add user to request object
                req.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };

                next();
            } catch (error) {
                if (!isRequired) {
                    next();
                    return;
                }
                return res.status(401).json({ error: 'Invalid token' });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({ error: 'Authentication failed' });
        }
    };
};

// Helper constant for optional auth
export const optionalAuth = authenticate(false);
export const requireAuth = authenticate(true);
