import { Request, Response } from 'express';
import { prisma } from '../index';
import { UserSchema } from '@events-platform/shared';
import bcrypt from 'bcryptjs';

export namespace UsersController {
    export const getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { events: true, registrations: true },
                    },
                },
            });
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };

    export const getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    events: true,
                    registrations: {
                        include: {
                            event: true,
                        },
                    },
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    };

    export const createUser = async (req: Request, res: Response) => {
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
                    createdAt: true,
                    updatedAt: true,
                },
            });
            res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(400).json({ error: 'Failed to create user' });
        }
    };

    export const updateUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const validatedData = UserSchema.parse(req.body);
            const updateData: any = {
                name: validatedData.name,
                email: validatedData.email,
            };
            if (validatedData.password) {
                updateData.password = await bcrypt.hash(validatedData.password, 10);
            }
            const user = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(400).json({ error: 'Failed to update user' });
        }
    };

    export const deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await prisma.registration.deleteMany({
                where: { userId: id },
            });
            await prisma.event.deleteMany({
                where: { organizerId: id },
            });
            await prisma.user.delete({
                where: { id },
            });
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    };
}