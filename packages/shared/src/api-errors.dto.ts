import { z } from 'zod';

const ApiErrorSchema = z.object({
    error: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
