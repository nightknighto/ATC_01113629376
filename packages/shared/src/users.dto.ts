import { z } from "zod";

// Common User fields
export const UserBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.enum(['user', 'admin'])
});

export const UserWithPasswordBaseSchema = UserBaseSchema.extend({
    password: z.string()
});

// Get all users response
export const GetAllUsersResponseSchema = z.array(UserBaseSchema);
export type GetAllUsersResponse = z.infer<typeof GetAllUsersResponseSchema>;

// Get user by ID response
export const GetUserByIdResponseSchema = UserBaseSchema;
export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseSchema>;

// Create user request
export const CreateUserRequestSchema = UserWithPasswordBaseSchema.pick({
    name: true,
    email: true,
    password: true
})

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

// Create user response
export const CreateUserResponseSchema = UserBaseSchema;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

// Update user request
export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

// Update user response
export const UpdateUserResponseSchema = UserBaseSchema;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;