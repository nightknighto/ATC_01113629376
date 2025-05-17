import { z } from 'zod';
import { EventBaseSchema } from './events.dto';
import { paginateResponse } from './pagination.dto';

// Common Event fields for admin
export const AdminEventBaseSchema = EventBaseSchema.omit({
    registrationCount: true,
});

// Get all events (admin) response
export const AdminGetAllEventsResponseSchema = paginateResponse(z.array(AdminEventBaseSchema));

export type AdminGetAllEventsResponse = z.infer<typeof AdminGetAllEventsResponseSchema>;

// Create event (admin) request (JSON, no image)
export const AdminCreateEventRequestSchema = AdminEventBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    date: true,
    image: true,
}).extend({
    date: z.string().datetime(),
});
export type AdminCreateEventRequest = z.infer<typeof AdminCreateEventRequestSchema>;

// Upload event image (admin) request (multipart/form-data)
export const AdminUploadEventImageRequestSchema = z.object({
    image: z.any(), // file, validated by multer
});
export type AdminUploadEventImageRequest = z.infer<typeof AdminUploadEventImageRequestSchema>;

// Upload event image (admin) response
export const AdminUploadEventImageResponseSchema = z.object({
    image: z.string(), // URL
});
export type AdminUploadEventImageResponse = z.infer<typeof AdminUploadEventImageResponseSchema>;

// Create event (admin) response
export const AdminCreateEventResponseSchema = AdminEventBaseSchema;
export type AdminCreateEventResponse = z.infer<typeof AdminCreateEventResponseSchema>;

// Update event (admin) request (all fields optional except id, createdAt, updatedAt omitted)
export const AdminUpdateEventRequestSchema = AdminCreateEventRequestSchema.partial();
export type AdminUpdateEventRequest = z.infer<typeof AdminUpdateEventRequestSchema>;

// Update event (admin) response
export const AdminUpdateEventResponseSchema = AdminEventBaseSchema;
export type AdminUpdateEventResponse = z.infer<typeof AdminUpdateEventResponseSchema>;

// Delete event (admin) response
export const AdminDeleteEventResponseSchema = z.object({
    success: z.boolean(),
});
export type AdminDeleteEventResponse = z.infer<typeof AdminDeleteEventResponseSchema>;
