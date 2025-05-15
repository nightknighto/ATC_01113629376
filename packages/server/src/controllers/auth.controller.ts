import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { UserSchema } from '@events-platform/shared';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export namespace AuthController {
    export const register = async (req: Request, res: Response) => {
        try {
            const validatedData = UserSchema.parse(req.body);
            const existingUser = await prisma.user.findUnique({
                where: { email: validatedData.email },
            });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(validatedData.password || '', 10);
            const user = await prisma.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.status(201).json({ user, token });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).json({ error: 'Failed to register user' });
        }
    };

    export const login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    };

    export const getMe = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(user);
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        } catch (error) {
            console.error('Error getting current user:', error);
            res.status(500).json({ error: 'Failed to get current user' });
        }
    };
}