import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AllSchemasWithExamples } from './openapi-example';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { Validators } from '../middleware/validators.middleware';
import { LoginRequestSchema, RegisterRequestSchema } from '@events-platform/shared';

const authRouter = express.Router();

// Register a new user
authRouter.post('/register', Validators.validateBody(RegisterRequestSchema), AuthController.register);

// Login user
authRouter.post('/login', Validators.validateBody(LoginRequestSchema), AuthController.login);

// Get current user
authRouter.get('/me', AuthController.getMe);

// -------------------------- OpenAPI --------------------------

const registerOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'register',
    summary: 'Register a new user',
    description: 'Register a new user and return a JWT token and user info.',
    tags: ['Auth'],
    requestBody: {
        description: 'User registration data',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.Register.request.schema,
                example: AllSchemasWithExamples.Register.request.example
            }
        }
    },
    responses: {
        '201': {
            description: 'User registered successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.Register.response.schema,
                    example: AllSchemasWithExamples.Register.response.example
                }
            }
        },
        '400': {
            description: 'Invalid input.'
        }
    }
};

const loginOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'login',
    summary: 'Login user',
    description: 'Authenticate a user and return a JWT token and user info.',
    tags: ['Auth'],
    requestBody: {
        description: 'User login credentials',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.Login.request.schema,
                example: AllSchemasWithExamples.Login.request.example
            }
        }
    },
    responses: {
        '200': {
            description: 'User logged in successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.Login.response.schema,
                    example: AllSchemasWithExamples.Login.response.example
                }
            }
        },
        '401': {
            description: 'Invalid credentials.'
        }
    }
};

const getMeOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'getMe',
    summary: 'Get current user',
    description: 'Get the currently authenticated user.',
    tags: ['Auth'],
    responses: {
        '200': {
            description: 'Current user info.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.GetMe.response.schema,
                    example: AllSchemasWithExamples.GetMe.response.example
                }
            }
        },
        '401': {
            description: 'Unauthorized.'
        }
    }
};

export const authOpenApiPaths = {
    '/auth/register': {
        post: registerOpenApiOperation
    },
    '/auth/login': {
        post: loginOpenApiOperation
    },
    '/auth/me': {
        get: getMeOpenApiOperation
    }
};

export default authRouter;