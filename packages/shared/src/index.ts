import { z } from 'zod';

// Event schema for validation
export const EventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    location: z.string().min(3, { message: 'Location must be at least 3 characters' }),
    organizerId: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// User schema for validation
export const UserSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Registration schema for validation
export const RegistrationSchema = z.object({
    id: z.string().optional(),
    eventId: z.string(),
    userId: z.string(),
    createdAt: z.date().optional(),
});

// Types derived from schemas
export type Event = z.infer<typeof EventSchema>;
export type User = z.infer<typeof UserSchema>;
export type Registration = z.infer<typeof RegistrationSchema>;

// API response types
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};