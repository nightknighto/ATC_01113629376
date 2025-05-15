import { Request, Response } from 'express';
import { UserSchema } from '@events-platform/shared';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models';

export namespace UsersController {
    export const getAllUsers = async (req: Request, res: Response) => {
        try {
            // Assuming UserModel has a method to get all users with counts
            const users = await UserModel.getAllWithCounts?.();
            if (users) {
                res.json(users);
            } else {
                // fallback to direct prisma if method not implemented
                res.status(501).json({ error: 'Not implemented in UserModel' });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };

    export const getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await UserModel.findByIdWithDetails?.(id);
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
            const user = await UserModel.update?.(id, updateData);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(400).json({ error: 'Failed to update user' });
        }
    };

    export const deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await UserModel.deleteByIdWithCascade?.(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'User not found or not deleted' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    };
}