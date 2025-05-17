import express from 'express';
import type { ZodOpenApiOperationObject } from 'zod-openapi';
import { EventsController } from '../controllers/events.controller';
import { optionalAuth, requireAuth } from '../middleware';
import { AllSchemasWithExamples } from './openapi-example';

const eventsRouter = express.Router();

eventsRouter.use(optionalAuth);

// Get all events
eventsRouter.get('/', EventsController.getAllEvents);

// Get event by ID
eventsRouter.get('/:id', EventsController.getEventById);

// Get all registrations for an event
eventsRouter.get('/:id/registrations', EventsController.getEventRegistrations);

eventsRouter.use(requireAuth);

// Register for an event
eventsRouter.post('/:id/register', EventsController.registerForEvent);

// Cancel registration for an event
eventsRouter.delete('/:id/register', EventsController.cancelRegistration);

export default eventsRouter;
// -------------------------- OpenAPI -------------------------- //

const getAllEventsOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'getAllEvents',
    summary: 'Get all events',
    description: 'Retrieve a list of all events.',
    tags: ['Events'],
    responses: {
        '200': {
            description: 'A list of all events.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.GetAllEvents.response.schema,
                    example: AllSchemasWithExamples.GetAllEvents.response.example,
                },
            },
        },
    },
};

const getEventByIdOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'getEventById',
    summary: 'Get event by ID',
    description: 'Retrieve a single event by its ID.',
    tags: ['Events'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the event to retrieve',
        },
    ],
    responses: {
        '200': {
            description: 'The event details.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.GetEventById.response.schema,
                    example: AllSchemasWithExamples.GetEventById.response.example,
                },
            },
        },
        '404': {
            description: 'Event not found.',
        },
    },
};

const registerForEventOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'registerForEvent',
    summary: 'Register for an event',
    description: 'Register a user for an event.',
    tags: ['Events'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the event to register for',
        },
    ],
    responses: {
        '201': {
            description: 'Registration successful.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.RegisterForEvent.response.schema,
                    example: AllSchemasWithExamples.RegisterForEvent.response.example,
                },
            },
        },
        '400': {
            description: 'Failed to register for event.',
        },
    },
};

const cancelRegistrationOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'cancelRegistration',
    summary: 'Cancel registration for an event',
    description: "Cancel a user's registration for an event.",
    tags: ['Events'],
    parameters: [
        {
            name: 'eventId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the event',
        },
        {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the user',
        },
    ],
    responses: {
        '204': {
            description: 'Registration cancelled successfully.',
        },
        '400': {
            description: 'Failed to cancel registration.',
        },
    },
};

export const eventsOpenApiPaths = {
    '/events': {
        get: getAllEventsOpenApiOperation,
    },
    '/events/{id}': {
        get: getEventByIdOpenApiOperation,
        post: registerForEventOpenApiOperation,
    },
    '/events/{eventId}/register/{userId}': {
        delete: cancelRegistrationOpenApiOperation,
    },
};
