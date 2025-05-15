import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});
