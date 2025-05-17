import { z } from "zod";
import { UserWithPasswordBaseSchema } from "./users.dto";

// Common Auth fields
export const AuthUserSchema = UserWithPasswordBaseSchema.omit({
    createdAt: true,
    updatedAt: true,
})

// Register request
export const RegisterRequestSchema = AuthUserSchema.pick({
    name: true,
    email: true,
    password: true,
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// Register response
export const RegisterResponseSchema = z.object({
    token: z.string(),
    user: AuthUserSchema.omit({ password: true }),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Login request
export const LoginRequestSchema = AuthUserSchema.pick({
    email: true,
    password: true
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Login response
export const LoginResponseSchema = z.object({
    token: z.string(),
    user: AuthUserSchema.omit({ password: true }),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// GetMe response
export const GetMeResponseSchema = AuthUserSchema.omit({ password: true });;
export type GetMeResponse = z.infer<typeof GetMeResponseSchema>;