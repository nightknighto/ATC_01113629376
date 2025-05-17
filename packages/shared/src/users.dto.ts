import { z } from 'zod';

// Common User fields
export const UserBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.enum(['user', 'admin']),
});

export const UserWithPasswordBaseSchema = UserBaseSchema.extend({
    password: z.string(),
});
