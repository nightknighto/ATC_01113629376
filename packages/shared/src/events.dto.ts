import { z } from "zod";
import { UserBaseSchema } from "./users.dto";

// Common Event fields
export const EventBaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.date(),
    location: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

const RegistrationsExtensionSchema = z.object({
    registrations: z.object({
        id: z.string(),
        user: UserBaseSchema.pick({
            id: true,
            name: true,
            email: true
        }),
    }).array()
})

const OrganizerExtensionSchema = z.object({
    organizer: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
    })
});

const EventWithDetailsSchema = EventBaseSchema.merge(RegistrationsExtensionSchema).merge(OrganizerExtensionSchema);

// Get all events response
export const GetAllEventsResponseSchema = z.array(EventWithDetailsSchema);
export type GetAllEventsResponse = z.infer<typeof GetAllEventsResponseSchema>;

// Get event by ID response
export const GetEventByIdResponseSchema = EventWithDetailsSchema;
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