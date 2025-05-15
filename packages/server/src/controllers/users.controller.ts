import { Request, Response } from 'express';
import { CreateUserRequest, CreateUserResponse, UpdateUserRequest, UpdateUserResponse, GetAllUsersResponse, GetUserByIdResponse, ApiError } from '@events-platform/shared';
import { UserModel } from '../models';
import { PasswordService } from '../services/password.service';

export namespace UsersController {
    export const getAllUsers = async (req: Request, res: Response<GetAllUsersResponse | ApiError>) => {
        try {
            const users = await UserModel.getAllWithCounts();
            if (users) {
                res.json(users);
            } else {
                res.status(501).json({ error: 'Not implemented in UserModel' });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };

    export const getUserById = async (req: Request, res: Response<GetUserByIdResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const user = await UserModel.findByIdWithDetails(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    };

    export const createUser = async (req: Request<{}, CreateUserResponse, CreateUserRequest>, res: Response<CreateUserResponse | ApiError>) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            const hashedPassword = await PasswordService.hashPassword(password || '');
            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword,
            });
            res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(400).json({ error: 'Failed to create user' });
        }
    };

    export const updateUser = async (req: Request<{ id: string }, UpdateUserResponse, UpdateUserRequest>, res: Response<UpdateUserResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;
            const updateData: any = {
                name,
                email,
            };
            if (password) {
                updateData.password = await PasswordService.hashPassword(password);
            }
            const user = await UserModel.update(id, updateData);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(400).json({ error: 'Failed to update user' });
        }
    };

    export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await UserModel.deleteByIdWithCascade(id);
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