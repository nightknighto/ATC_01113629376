import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import mainRouter from './routes';
import { rateLimiter } from './middleware/rate-limiter.middleware';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Use rate limiter globally
app.use(rateLimiter);

// Middleware
app.use(cors());
app.use(express.json());

app.use(mainRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});