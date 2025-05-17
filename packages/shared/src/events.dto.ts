import { z } from "zod";
import { UserBaseSchema } from "./users.dto";
import { paginateResponse } from "./pagination.dto";

// Common Event fields
export const EventBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.date(),
    venue: z.string(),
    price: z.number(),
    image: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    registrationCount: z.number(),
});

const OrganizerExtensionSchema = z.object({
    organizer: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
    })
});

const EventWithDetailsSchema = EventBaseSchema.merge(OrganizerExtensionSchema).extend({
    isRegistered: z.boolean(), // Indicates if the current user is registered
});

// Get all events response
export const GetAllEventsResponseSchema = paginateResponse(z.array(EventWithDetailsSchema));
export type GetAllEventsResponse = z.infer<typeof GetAllEventsResponseSchema>;

// Get event by ID response
export const GetEventByIdResponseSchema = EventWithDetailsSchema;
export type GetEventByIdResponse = z.infer<typeof GetEventByIdResponseSchema>;

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

// Registration DTO for event registrations endpoint
export const EventRegistrationSchema = z.object({
    id: z.string(),
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
    })
});
export const GetEventRegistrationsResponseSchema = paginateResponse(z.array(EventRegistrationSchema));
export type GetEventRegistrationsResponse = z.infer<typeof GetEventRegistrationsResponseSchema>;
