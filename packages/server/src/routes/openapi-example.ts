import { z } from "zod";
import {
    GetAllEventsResponseSchema,
    GetEventByIdResponseSchema,
    RegisterForEventRequestSchema,
    RegisterForEventResponseSchema,
    CancelRegistrationResponseSchema
} from "@events-platform/shared";
import {
    AdminGetAllEventsResponseSchema,
    AdminCreateEventRequestSchema,
    AdminCreateEventResponseSchema,
    AdminUpdateEventRequestSchema,
    AdminUpdateEventResponseSchema,
    AdminDeleteEventResponseSchema
} from "@events-platform/shared";
import {
    RegisterRequestSchema,
    RegisterResponseSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    GetMeResponseSchema
} from "@events-platform/shared";
import {
    GetAllUsersResponseSchema,
    GetUserByIdResponseSchema,
    CreateUserRequestSchema,
    CreateUserResponseSchema,
    UpdateUserRequestSchema,
    UpdateUserResponseSchema
} from "@events-platform/shared";

// --- Examples for Events DTOs ---
const GetAllEventsResponseExample = [
    {
        id: "evt1",
        title: "Annual Tech Conference",
        description: "A conference about the latest in tech.",
        date: new Date("2024-09-01T09:00:00Z"),
        location: "Tech Hall, City Center",
        createdAt: new Date("2024-07-01T10:00:00Z"),
        updatedAt: new Date("2024-07-10T12:00:00Z"),
        registrations: [
            {
                id: "reg1",
                user: {
                    id: "user1",
                    name: "Alice",
                    email: "alice@example.com"
                }
            }
        ],
        organizer: {
            id: "org1",
            name: "Bob",
            email: "bob@org.com"
        }
    }
];

const GetEventByIdResponseExample = GetAllEventsResponseExample[0];

const RegisterForEventRequestExample = {
    userId: "user1"
};

const RegisterForEventResponseExample = {
    success: true
};

const CancelRegistrationResponseExample = {
    success: true
};

// --- Examples for Admin DTOs ---
const AdminGetAllEventsResponseExample = [
    {
        id: "evt1",
        title: "Annual Tech Conference",
        description: "A conference about the latest in tech.",
        date: new Date("2024-09-01T09:00:00Z"),
        location: "Tech Hall, City Center",
        createdAt: new Date("2024-07-01T10:00:00Z"),
        updatedAt: new Date("2024-07-10T12:00:00Z")
    }
];

const AdminCreateEventRequestExample = {
    title: "New Event",
    description: "Description of the event.",
    date: new Date("2024-10-01T09:00:00Z"),
    location: "Main Hall"
};

const AdminCreateEventResponseExample = {
    id: "evt2",
    title: "New Event",
    description: "Description of the event.",
    date: new Date("2024-10-01T09:00:00Z"),
    location: "Main Hall",
    createdAt: new Date("2024-08-01T10:00:00Z"),
    updatedAt: new Date("2024-08-01T10:00:00Z")
};

const AdminUpdateEventRequestExample = {
    title: "Updated Event Title"
};

const AdminUpdateEventResponseExample = AdminCreateEventResponseExample;

const AdminDeleteEventResponseExample = {
    success: true
};

// --- Examples for Auth DTOs ---
const RegisterRequestExample = {
    name: "Charlie",
    email: "charlie@example.com",
    password: "password123"
};

const RegisterResponseExample = {
    token: "jwt.token.here",
    user: {
        id: "user2",
        name: "Charlie",
        email: "charlie@example.com",
        createdAt: new Date("2024-08-01T10:00:00Z"),
        updatedAt: new Date("2024-08-01T10:00:00Z"),
        role: "user"
    }
};

const LoginRequestExample = {
    email: "charlie@example.com",
    password: "password123"
};

const LoginResponseExample = RegisterResponseExample;

const GetMeResponseExample = RegisterResponseExample.user;

// --- Examples for Users DTOs ---
const GetAllUsersResponseExample = [
    {
        id: "user1",
        name: "Alice",
        email: "alice@example.com",
        createdAt: new Date("2024-07-01T10:00:00Z"),
        updatedAt: new Date("2024-07-10T12:00:00Z"),
        role: "user"
    }
];

const GetUserByIdResponseExample = GetAllUsersResponseExample[0];

const CreateUserRequestExample = {
    name: "David",
    email: "david@example.com",
    password: "securepass"
};

const CreateUserResponseExample = {
    id: "user3",
    name: "David",
    email: "david@example.com",
    createdAt: new Date("2024-08-01T10:00:00Z"),
    updatedAt: new Date("2024-08-01T10:00:00Z"),
    role: "user"
};

const UpdateUserRequestExample = {
    name: "David Updated"
};

const UpdateUserResponseExample = CreateUserResponseExample;

// --- All Schemas With Examples ---
export const AllSchemasWithExamples = {
    GetAllEvents: {
        response: {
            schema: GetAllEventsResponseSchema,
            example: GetAllEventsResponseExample as z.infer<typeof GetAllEventsResponseSchema>
        }
    },
    GetEventById: {
        response: {
            schema: GetEventByIdResponseSchema,
            example: GetEventByIdResponseExample as z.infer<typeof GetEventByIdResponseSchema>
        }
    },
    RegisterForEvent: {
        request: {
            schema: RegisterForEventRequestSchema,
            example: RegisterForEventRequestExample as z.infer<typeof RegisterForEventRequestSchema>
        },
        response: {
            schema: RegisterForEventResponseSchema,
            example: RegisterForEventResponseExample as z.infer<typeof RegisterForEventResponseSchema>
        }
    },
    CancelRegistration: {
        response: {
            schema: CancelRegistrationResponseSchema,
            example: CancelRegistrationResponseExample as z.infer<typeof CancelRegistrationResponseSchema>
        }
    },
    AdminGetAllEvents: {
        response: {
            schema: AdminGetAllEventsResponseSchema,
            example: AdminGetAllEventsResponseExample as z.infer<typeof AdminGetAllEventsResponseSchema>
        }
    },
    AdminCreateEvent: {
        request: {
            schema: AdminCreateEventRequestSchema,
            example: AdminCreateEventRequestExample as z.infer<typeof AdminCreateEventRequestSchema>
        },
        response: {
            schema: AdminCreateEventResponseSchema,
            example: AdminCreateEventResponseExample as z.infer<typeof AdminCreateEventResponseSchema>
        }
    },
    AdminUpdateEvent: {
        request: {
            schema: AdminUpdateEventRequestSchema,
            example: AdminUpdateEventRequestExample as z.infer<typeof AdminUpdateEventRequestSchema>
        },
        response: {
            schema: AdminUpdateEventResponseSchema,
            example: AdminUpdateEventResponseExample as z.infer<typeof AdminUpdateEventResponseSchema>
        }
    },
    AdminDeleteEvent: {
        response: {
            schema: AdminDeleteEventResponseSchema,
            example: AdminDeleteEventResponseExample as z.infer<typeof AdminDeleteEventResponseSchema>
        }
    },
    Register: {
        request: {
            schema: RegisterRequestSchema,
            example: RegisterRequestExample as z.infer<typeof RegisterRequestSchema>
        },
        response: {
            schema: RegisterResponseSchema,
            example: RegisterResponseExample as z.infer<typeof RegisterResponseSchema>
        }
    },
    Login: {
        request: {
            schema: LoginRequestSchema,
            example: LoginRequestExample as z.infer<typeof LoginRequestSchema>
        },
        response: {
            schema: LoginResponseSchema,
            example: LoginResponseExample as z.infer<typeof LoginResponseSchema>
        }
    },
    GetMe: {
        response: {
            schema: GetMeResponseSchema,
            example: GetMeResponseExample as z.infer<typeof GetMeResponseSchema>
        }
    },
    GetAllUsers: {
        response: {
            schema: GetAllUsersResponseSchema,
            example: GetAllUsersResponseExample as z.infer<typeof GetAllUsersResponseSchema>
        }
    },
    GetUserById: {
        response: {
            schema: GetUserByIdResponseSchema,
            example: GetUserByIdResponseExample as z.infer<typeof GetUserByIdResponseSchema>
        }
    },
    CreateUser: {
        request: {
            schema: CreateUserRequestSchema,
            example: CreateUserRequestExample as z.infer<typeof CreateUserRequestSchema>
        },
        response: {
            schema: CreateUserResponseSchema,
            example: CreateUserResponseExample as z.infer<typeof CreateUserResponseSchema>
        }
    },
    UpdateUser: {
        request: {
            schema: UpdateUserRequestSchema,
            example: UpdateUserRequestExample as z.infer<typeof UpdateUserRequestSchema>
        },
        response: {
            schema: UpdateUserResponseSchema,
            example: UpdateUserResponseExample as z.infer<typeof UpdateUserResponseSchema>
        }
    }
} as const;