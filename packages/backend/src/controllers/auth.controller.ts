import bcrypt from 'bcryptjs';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, GetMeResponse, ApiError } from '@events-platform/shared';
import { Request, Response } from 'express';
import { UserModel } from '../models';
import { JwtService } from '../services';

export namespace AuthController {
    export const register = async (req: Request<{}, RegisterResponse, RegisterRequest>, res: Response<RegisterResponse | ApiError>) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password || '', 10);
            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword,
            });
            const token = JwtService.createToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });
            const { password: _, ...returnedUser } = user;
            res.status(201).json({ user: returnedUser, token });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).json({ error: 'Failed to register user' });
        }
    };

    export const login = async (req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse | ApiError>) => {
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
            const token = JwtService.createToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });

            const { password: _, ...returnedUser } = user;
            res.json({
                user: returnedUser,
                token,
            });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    };

    export const getMe = async (req: Request, res: Response<GetMeResponse | ApiError>) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const user = JwtService.verifyToken(token);
                
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