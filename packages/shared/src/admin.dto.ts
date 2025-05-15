import { z } from "zod";

// Common Event fields for admin
export const AdminEventBaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.date(),
    location: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Get all events (admin) response
export const AdminGetAllEventsResponseSchema = z.array(AdminEventBaseSchema);
export type AdminGetAllEventsResponse = z.infer<typeof AdminGetAllEventsResponseSchema>;

// Create event (admin) request (omit id, createdAt, updatedAt)
export const AdminCreateEventRequestSchema = AdminEventBaseSchema.pick({ title: true, description: true, date: true, location: true });
export type AdminCreateEventRequest = z.infer<typeof AdminCreateEventRequestSchema>;

// Create event (admin) response
export const AdminCreateEventResponseSchema = AdminEventBaseSchema;
export type AdminCreateEventResponse = z.infer<typeof AdminCreateEventResponseSchema>;

// Update event (admin) request (all fields optional except id, createdAt, updatedAt omitted)
export const AdminUpdateEventRequestSchema = AdminEventBaseSchema.pick({ title: true, description: true, date: true, location: true }).partial();
export type AdminUpdateEventRequest = z.infer<typeof AdminUpdateEventRequestSchema>;

// Update event (admin) response
export const AdminUpdateEventResponseSchema = AdminEventBaseSchema;
export type AdminUpdateEventResponse = z.infer<typeof AdminUpdateEventResponseSchema>;

// Delete event (admin) response
export const AdminDeleteEventResponseSchema = z.object({
    success: z.boolean(),
});
export type AdminDeleteEventResponse = z.infer<typeof AdminDeleteEventResponseSchema>;