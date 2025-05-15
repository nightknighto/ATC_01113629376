import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = express.Router();

// Register a new user
authRouter.post('/register', AuthController.register);

// Login user
authRouter.post('/login', AuthController.login);

// Get current user
authRouter.get('/me', AuthController.getMe);

export default authRouter;