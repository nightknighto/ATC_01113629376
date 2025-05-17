import { createDocument } from 'zod-openapi';
import { CONFIG } from '../config';
import { openApiPaths } from '../routes/openapi-paths';

export const OASDocument = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'Event Platform API',
        description: 'An API for managing events',
        version: '1.0.0',
    },
    paths: openApiPaths,
    servers: [
        {
            url: CONFIG.server.apiBaseUrl,
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
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
});
