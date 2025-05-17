import type { USER_ROLE } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

const JWT_SECRET = CONFIG.server.jwtSecret;

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: USER_ROLE;
}

export namespace JwtService {
    export const createToken = (payload: JwtPayload) => {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    };

    export const verifyToken = (token: string) => {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    };
}
