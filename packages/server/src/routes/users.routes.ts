import express from 'express';
import { UsersController } from '../controllers/users.controller';
import { AllSchemasWithExamples } from './openapi-example';
import { ZodOpenApiOperationObject } from 'zod-openapi';

const userRouter = express.Router();

// Get all users
userRouter.get('/', UsersController.getAllUsers);

// Get user by ID
userRouter.get('/:id', UsersController.getUserById);

// Create a new user
userRouter.post('/', UsersController.createUser);

// Update a user
userRouter.put('/:id', UsersController.updateUser);

// Delete a user
userRouter.delete('/:id', UsersController.deleteUser);

// -------------------------- OpenAPI --------------------------
const getAllUsersOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'getAllUsers',
    summary: 'Get all users',
    description: 'Retrieve a list of all users.',
    tags: ['Users'],
    responses: {
        '200': {
            description: 'A list of all users.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.GetAllUsers.response.schema,
                    example: AllSchemasWithExamples.GetAllUsers.response.example
                }
            }
        }
    }
};

const getUserByIdOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'getUserById',
    summary: 'Get user by ID',
    description: 'Retrieve a user by their ID.',
    tags: ['Users'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the user to retrieve'
        }
    ],
    responses: {
        '200': {
            description: 'The user details.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.GetUserById.response.schema,
                    example: AllSchemasWithExamples.GetUserById.response.example
                }
            }
        },
        '404': {
            description: 'User not found.'
        }
    }
};

const createUserOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'createUser',
    summary: 'Create a new user',
    description: 'Create a new user in the system.',
    tags: ['Users'],
    requestBody: {
        description: 'User data to create',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.CreateUser.request.schema,
                example: AllSchemasWithExamples.CreateUser.request.example
            }
        }
    },
    responses: {
        '201': {
            description: 'The user was created successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.CreateUser.response.schema,
                    example: AllSchemasWithExamples.CreateUser.response.example
                }
            }
        },
        '400': {
            description: 'Invalid input.'
        }
    }
};

const updateUserOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'updateUser',
    summary: 'Update a user',
    description: 'Update an existing user by ID.',
    tags: ['Users'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the user to update'
        }
    ],
    requestBody: {
        description: 'User data to update',
        required: true,
        content: {
            'application/json': {
                schema: AllSchemasWithExamples.UpdateUser.request.schema,
                example: AllSchemasWithExamples.UpdateUser.request.example
            }
        }
    },
    responses: {
        '200': {
            description: 'The user was updated successfully.',
            content: {
                'application/json': {
                    schema: AllSchemasWithExamples.UpdateUser.response.schema,
                    example: AllSchemasWithExamples.UpdateUser.response.example
                }
            }
        },
        '400': {
            description: 'Invalid input.'
        },
        '404': {
            description: 'User not found.'
        }
    }
};

const deleteUserOpenApiOperation: ZodOpenApiOperationObject = {
    operationId: 'deleteUser',
    summary: 'Delete a user',
    description: 'Delete a user by ID.',
    tags: ['Users'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the user to delete'
        }
    ],
    responses: {
        '204': {
            description: 'User deleted successfully.'
        },
        '404': {
            description: 'User not found.'
        }
    }
};

export const usersOpenApiPaths = {
    '/users': {
        get: getAllUsersOpenApiOperation,
        post: createUserOpenApiOperation
    },
    '/users/{id}': {
        get: getUserByIdOpenApiOperation,
        put: updateUserOpenApiOperation,
        delete: deleteUserOpenApiOperation
    }
};

export default userRouter;