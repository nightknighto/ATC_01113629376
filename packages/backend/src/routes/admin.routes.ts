import {
    AdminCreateEventRequestSchema,
    AdminUpdateEventRequestSchema,
} from '@events-platform/shared';
import express from 'express';
import type { ZodOpenApiOperationObject } from 'zod-openapi';
import { AdminEventsController } from '../controllers/admin-events.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';
import { Validators } from '../middleware/validators.middleware';
import { AllSchemasWithExamples } from './openapi-example';

const adminEventsRouter = express.Router();

// All routes require authentication and admin role
adminEventsRouter.use(requireAuth, requireAdmin);

// Get all events (admin)
adminEventsRouter.get('/events', AdminEventsController.getAllEvents);
// Create event
adminEventsRouter.post(
    '/events',
    Validators.validateBody(AdminCreateEventRequestSchema),
    AdminEventsController.createEvent,
);
// Update event
adminEventsRouter.put(
    '/events/:id',
    Validators.validateBody(AdminUpdateEventRequestSchema),
    AdminEventsController.updateEvent,
);
// Delete event
adminEventsRouter.delete('/events/:id', AdminEventsController.deleteEvent);
// Upload event image (admin, for existing event)
adminEventsRouter.post('/events/:id/image', AdminEventsController.uploadEventImage);

export default adminEventsRouter;

// -------------------------- OpenAPI -------------------------- //
const adminGetAllEventsOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'adminGetAllEvents',
    summary: 'Get all events (admin)',
    description: 'Retrieve a list of all events with admin privileges.',
    tags: ['Admin Events'],
    responses: {
        '200': {
            description: 'A list of all events (admin view).',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.AdminGetAllEvents.response.schema,
                    example: AllSchemasWithExamples.AdminGetAllEvents.response.example,
                },
            },
        },
    },
};

const adminCreateEventOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'adminCreateEvent',
    summary: 'Create event',
    description: 'Create a new event as an admin.',
    tags: ['Admin Events'],
    requestBody: {
        description: 'Event data to create',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.AdminCreateEvent.request.schema,
                example: AllSchemasWithExamples.AdminCreateEvent.request.example,
            },
        },
    },
    responses: {
        '201': {
            description: 'The event was created successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.AdminCreateEvent.response.schema,
                    example: AllSchemasWithExamples.AdminCreateEvent.response.example,
                },
            },
        },
    },
};

const adminUpdateEventOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'adminUpdateEvent',
    summary: 'Update event',
    description: 'Update an existing event as an admin.',
    tags: ['Admin Events'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the event to update',
        },
    ],
    requestBody: {
        description: 'Event data to update',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.AdminUpdateEvent.request.schema,
                example: AllSchemasWithExamples.AdminUpdateEvent.request.example,
            },
        },
    },
    responses: {
        '200': {
            description: 'The event was updated successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.AdminUpdateEvent.response.schema,
                    example: AllSchemasWithExamples.AdminUpdateEvent.response.example,
                },
            },
        },
        '400': {
            description: 'No changes specified.',
        },
    },
};

const adminDeleteEventOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'adminDeleteEvent',
    summary: 'Delete event',
    description: 'Delete an event as an admin.',
    tags: ['Admin Events'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the event to delete',
        },
    ],
    responses: {
        '200': {
            description: 'The event was deleted successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.AdminDeleteEvent.response.schema,
                    example: AllSchemasWithExamples.AdminDeleteEvent.response.example,
                },
            },
        },
    },
};

export const adminEventsOpenApiPaths = {
    '/admin/events': {
        get: adminGetAllEventsOpenApiOperation,
        post: adminCreateEventOpenApiOperation,
    },
    '/admin/events/{id}': {
        put: adminUpdateEventOpenApiOperation,
        delete: adminDeleteEventOpenApiOperation,
    },
};
