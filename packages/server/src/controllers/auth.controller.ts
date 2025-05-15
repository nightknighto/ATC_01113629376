import bcrypt from 'bcryptjs';
import { UserSchema } from '@events-platform/shared';
import { Request, Response } from 'express';
import { UserModel } from '../models';
import { JwtService } from '../services';

export namespace AuthController {
    export const register = async (req: Request, res: Response) => {
        try {
            const validatedData = UserSchema.parse(req.body);
            const existingUser = await UserModel.findByEmail(validatedData.email);
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(validatedData.password || '', 10);
            const user = await UserModel.create({
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            });
            const token = JwtService.sign({ userId: user.id, email: user.email });
            res.status(201).json({ user, token });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).json({ error: 'Failed to register user' });
        }
    };

    export const login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = JwtService.sign({ userId: user.id, email: user.email });
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
                const decoded = JwtService.verify<{ userId: string }>(token);
                const user = await UserModel.findById(decoded.userId);
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