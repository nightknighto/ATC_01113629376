import { z } from "zod";

// Common Event fields
export const EventBaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    location: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Get all events response
export const GetAllEventsResponseSchema = z.array(EventBaseSchema);
export type GetAllEventsResponse = z.infer<typeof GetAllEventsResponseSchema>;

// Get event by ID response
export const GetEventByIdResponseSchema = EventBaseSchema;
export type GetEventByIdResponse = z.infer<typeof GetEventByIdResponseSchema>;

// Create event request
export const CreateEventRequestSchema = EventBaseSchema.pick({
    title: true,
    description: true,
    date: true,
    location: true,
})

export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

// Create event response
export const CreateEventResponseSchema = EventBaseSchema;
export type CreateEventResponse = z.infer<typeof CreateEventResponseSchema>;

// Update event request
export const UpdateEventRequestSchema = CreateEventRequestSchema.partial()

export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;

// Update event response
export const UpdateEventResponseSchema = EventBaseSchema;
export type UpdateEventResponse = z.infer<typeof UpdateEventResponseSchema>;

// Register for event request
export const RegisterForEventRequestSchema = z.object({
    userId: z.string(),
});
export type RegisterForEventRequest = z.infer<typeof RegisterForEventRequestSchema>;

// Register for event response
export const RegisterForEventResponseSchema = z.object({
    success: z.boolean(),
});
export type RegisterForEventResponse = z.infer<typeof RegisterForEventResponseSchema>;

// Cancel registration response
export const CancelRegistrationResponseSchema = z.object({
    success: z.boolean(),
});
export type CancelRegistrationResponse = z.infer<typeof CancelRegistrationResponseSchema>;