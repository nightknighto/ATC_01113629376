import { z } from 'zod';

// Pagination metadata schema
export const PaginationMetaSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export function paginateResponse<T extends z.ZodTypeAny>(schema: T) {
    return z.object({
        data: schema,
        pagination: PaginationMetaSchema,
    });
}
