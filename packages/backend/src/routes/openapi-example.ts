import {
    CancelRegistrationResponseSchema,
    GetAllEventsResponseSchema,
    GetEventByIdResponseSchema,
    RegisterForEventResponseSchema,
} from '@events-platform/shared';
import {
    AdminCreateEventRequestSchema,
    AdminCreateEventResponseSchema,
    AdminDeleteEventResponseSchema,
    AdminGetAllEventsResponseSchema,
    AdminUpdateEventRequestSchema,
    AdminUpdateEventResponseSchema,
} from '@events-platform/shared';
import {
    GetMeResponseSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    RegisterRequestSchema,
    RegisterResponseSchema,
} from '@events-platform/shared';
import type { z } from 'zod';

// --- Examples for Events DTOs ---
const GetAllEventsResponseExample = {
    data: [
        {
            id: 'evt1',
            name: 'Annual Tech Conference',
            description: 'A conference about the latest in tech.',
            category: 'Technology',
            date: new Date('2024-09-01T09:00:00Z'),
            venue: 'Tech Hall, City Center',
            price: 99.99,
            image: 'https://example.com/event1.jpg',
            createdAt: new Date('2024-07-01T10:00:00Z'),
            updatedAt: new Date('2024-07-10T12:00:00Z'),
            registrationCount: 42,
            isRegistered: false,
            organizer: {
                id: 'org1',
                name: 'Bob',
                email: 'bob@org.com',
            },
        },
    ],
    pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
    },
};

const GetEventByIdResponseExample = GetAllEventsResponseExample['data'][0];

const RegisterForEventRequestExample = {
    userId: 'user1',
} as const;

const RegisterForEventResponseExample = {
    success: true,
} as const;

const CancelRegistrationResponseExample = {
    success: true,
} as const;

// --- Examples for Admin DTOs ---
const AdminGetAllEventsResponseExample = {
    data: [
        {
            id: 'evt1',
            name: 'Annual Tech Conference',
            description: 'A conference about the latest in tech.',
            category: 'Technology',
            date: new Date('2024-09-01T09:00:00Z'),
            venue: 'Tech Hall, City Center',
            price: 99.99,
            image: 'https://example.com/event1.jpg',
            createdAt: new Date('2024-07-01T10:00:00Z'),
            updatedAt: new Date('2024-07-10T12:00:00Z'),
        },
    ],
    pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
    },
};

const AdminCreateEventRequestExample = {
    name: 'New Event',
    description: 'Description of the event.',
    category: 'Business',
    date: '2024-10-01T09:00:00Z',
    venue: 'Main Hall',
    price: 49.99,
    image: 'https://example.com/event2.jpg',
} as const;

const AdminCreateEventResponseExample = {
    id: 'evt2',
    name: 'New Event',
    description: 'Description of the event.',
    category: 'Business',
    date: new Date('2024-10-01T09:00:00Z'),
    venue: 'Main Hall',
    price: 49.99,
    image: 'https://example.com/event2.jpg',
    createdAt: new Date('2024-08-01T10:00:00Z'),
    updatedAt: new Date('2024-08-01T10:00:00Z'),
} as const;

const AdminUpdateEventRequestExample = {
    name: 'Updated Event Name',
    description: 'Updated description.',
    category: 'Education',
    date: '2024-11-01T09:00:00Z',
    venue: 'Updated Venue',
    price: 59.99,
    image: 'https://example.com/event2-updated.jpg',
};

const AdminUpdateEventResponseExample = AdminCreateEventResponseExample;

const AdminDeleteEventResponseExample = {
    success: true,
} as const;

// --- Examples for Auth DTOs ---
const RegisterRequestExample = {
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'password123',
} as const;

const RegisterResponseExample = {
    token: 'jwt.token.here',
    user: {
        id: 'user2',
        name: 'Charlie',
        email: 'charlie@example.com',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        updatedAt: new Date('2024-08-01T10:00:00Z'),
        role: 'user',
    },
} as const;

const LoginRequestExample = {
    email: 'charlie@example.com',
    password: 'password123',
} as const;

const LoginResponseExample = RegisterResponseExample;

const GetMeResponseExample = RegisterResponseExample.user;

// --- Examples for Users DTOs ---
const GetAllUsersResponseExample = [
    {
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2024-07-01T10:00:00Z'),
        updatedAt: new Date('2024-07-10T12:00:00Z'),
        role: 'user',
    } as const,
];

const GetUserByIdResponseExample = GetAllUsersResponseExample[0];

const CreateUserRequestExample = {
    name: 'David',
    email: 'david@example.com',
    password: 'securepass',
} as const;

const CreateUserResponseExample = {
    id: 'user3',
    name: 'David',
    email: 'david@example.com',
    createdAt: new Date('2024-08-01T10:00:00Z'),
    updatedAt: new Date('2024-08-01T10:00:00Z'),
    role: 'user',
} as const;

const UpdateUserRequestExample = {
    name: 'David Updated',
} as const;

const UpdateUserResponseExample = CreateUserResponseExample;

// --- All Schemas With Examples ---
export const AllSchemasWithExamples = {
    GetAllEvents: {
        response: {
            schema: GetAllEventsResponseSchema,
            example: GetAllEventsResponseExample satisfies z.infer<
                typeof GetAllEventsResponseSchema
            >,
        },
    },
    GetEventById: {
        response: {
            schema: GetEventByIdResponseSchema,
            example: GetEventByIdResponseExample satisfies z.infer<
                typeof GetEventByIdResponseSchema
            >,
        },
    },
    RegisterForEvent: {
        response: {
            schema: RegisterForEventResponseSchema,
            example: RegisterForEventResponseExample satisfies z.infer<
                typeof RegisterForEventResponseSchema
            >,
        },
    },
    CancelRegistration: {
        response: {
            schema: CancelRegistrationResponseSchema,
            example: CancelRegistrationResponseExample satisfies z.infer<
                typeof CancelRegistrationResponseSchema
            >,
        },
    },
    AdminGetAllEvents: {
        response: {
            schema: AdminGetAllEventsResponseSchema,
            example: AdminGetAllEventsResponseExample satisfies z.infer<
                typeof AdminGetAllEventsResponseSchema
            >,
        },
    },
    AdminCreateEvent: {
        request: {
            schema: AdminCreateEventRequestSchema,
            example: AdminCreateEventRequestExample satisfies z.infer<
                typeof AdminCreateEventRequestSchema
            >,
        },
        response: {
            schema: AdminCreateEventResponseSchema,
            example: AdminCreateEventResponseExample satisfies z.infer<
                typeof AdminCreateEventResponseSchema
            >,
        },
    },
    AdminUpdateEvent: {
        request: {
            schema: AdminUpdateEventRequestSchema,
            example: AdminUpdateEventRequestExample satisfies z.infer<
                typeof AdminUpdateEventRequestSchema
            >,
        },
        response: {
            schema: AdminUpdateEventResponseSchema,
            example: AdminUpdateEventResponseExample satisfies z.infer<
                typeof AdminUpdateEventResponseSchema
            >,
        },
    },
    AdminDeleteEvent: {
        response: {
            schema: AdminDeleteEventResponseSchema,
            example: AdminDeleteEventResponseExample satisfies z.infer<
                typeof AdminDeleteEventResponseSchema
            >,
        },
    },
    Register: {
        request: {
            schema: RegisterRequestSchema,
            example: RegisterRequestExample satisfies z.infer<typeof RegisterRequestSchema>,
        },
        response: {
            schema: RegisterResponseSchema,
            example: RegisterResponseExample satisfies z.infer<typeof RegisterResponseSchema>,
        },
    },
    Login: {
        request: {
            schema: LoginRequestSchema,
            example: LoginRequestExample satisfies z.infer<typeof LoginRequestSchema>,
        },
        response: {
            schema: LoginResponseSchema,
            example: LoginResponseExample satisfies z.infer<typeof LoginResponseSchema>,
        },
    },
    GetMe: {
        response: {
            schema: GetMeResponseSchema,
            example: GetMeResponseExample satisfies z.infer<typeof GetMeResponseSchema>,
        },
    },
} as const;
