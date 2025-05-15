import express from 'express';
import { UsersController } from '../controllers/users.controller';

const userRouter = express.Router();

// Get all users
userRouter.get('/', UsersController.getAllUsers);

// Get user by ID
userRouter.get('/:id', UsersController.getUserById);

// Create a new user
userRouter.post('/', UsersController.createUser);

// Update a user
userRouter.put('/:id', UsersController.updateUser);

// Delete a user
userRouter.delete('/:id', UsersController.deleteUser);

export default userRouter;