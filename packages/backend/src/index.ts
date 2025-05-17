import express from 'express';
import cors from 'cors';
import mainRouter from './routes';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import { CONFIG } from './config';

// Create Express app
const app = express();
const PORT = CONFIG.server.port

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

export default app;