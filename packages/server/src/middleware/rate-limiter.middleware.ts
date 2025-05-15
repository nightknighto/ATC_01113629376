import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 5,         // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
