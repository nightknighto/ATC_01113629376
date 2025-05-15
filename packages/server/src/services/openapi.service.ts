import { createDocument } from 'zod-openapi';
import { openApiPaths } from '../routes/openapi-paths';
import { AllSchemasWithExamples } from '../routes/openapi-example';

export const OASDocument = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'AstroCloud API',
        description: 'An API for managing User projects',
        version: '1.0.0',
    },
    paths: openApiPaths,
    servers: [
        {
            url: `http://localhost:${process.env.port}`,
            description: 'Local development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            // GetAllEventsResponseSchema: AllSchemasWithExamples.GetAllEvents.response.schema,
            // // GetEventByIdResponseSchema: AllSchemasWithExamples.GetEventById.response.schema,
            // RegisterForEventRequestSchema: AllSchemasWithExamples.RegisterForEvent.request.schema,
            // RegisterForEventResponseSchema: AllSchemasWithExamples.RegisterForEvent.response.schema,
            // CancelRegistrationResponseSchema: AllSchemasWithExamples.CancelRegistration.response.schema,
            // AdminGetAllEventsResponseSchema: AllSchemasWithExamples.AdminGetAllEvents.response.schema,
            // AdminCreateEventRequestSchema: AllSchemasWithExamples.AdminCreateEvent.request.schema,
            // AdminCreateEventResponseSchema: AllSchemasWithExamples.AdminCreateEvent.response.schema,
            // AdminUpdateEventRequestSchema: AllSchemasWithExamples.AdminUpdateEvent.request.schema,
            // AdminUpdateEventResponseSchema: AllSchemasWithExamples.AdminUpdateEvent.response.schema,
            // AdminDeleteEventResponseSchema: AllSchemasWithExamples.AdminDeleteEvent.response.schema,
            // RegisterRequestSchema: AllSchemasWithExamples.Register.request.schema,
            // RegisterResponseSchema: AllSchemasWithExamples.Register.response.schema,
            // LoginRequestSchema: AllSchemasWithExamples.Login.request.schema,
            // LoginResponseSchema: AllSchemasWithExamples.Login.response.schema,
            // GetMeResponseSchema: AllSchemasWithExamples.GetMe.response.schema,
            // GetAllUsersResponseSchema: AllSchemasWithExamples.GetAllUsers.response.schema,
            // GetUserByIdResponseSchema: AllSchemasWithExamples.GetUserById.response.schema,
            // CreateUserRequestSchema: AllSchemasWithExamples.CreateUser.request.schema,
            // CreateUserResponseSchema: AllSchemasWithExamples.CreateUser.response.schema,
            // UpdateUserRequestSchema: AllSchemasWithExamples.UpdateUser.request.schema,
            // UpdateUserResponseSchema: AllSchemasWithExamples.UpdateUser.response.schema,
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
});
