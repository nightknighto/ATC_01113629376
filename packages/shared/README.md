# Shared Package

This package contains shared code used across the Events Platform project, including TypeScript types, DTOs (Data Transfer Objects), and other utilities that are common to both the frontend and backend.

## Contents
- **DTOs**: Data structures for API requests and responses
- **Types**: Common TypeScript types and interfaces
- **Utilities**: Helper functions (if any)

## Usage
Import types or DTOs from this package in your frontend or backend code:

```ts
import { SomeType, SomeDto } from '@events-platform/shared';
```

Make sure your project dependencies are set up to resolve the `@events-platform/shared` alias or path.

## Contributing
- Keep shared code generic and free of frontend/backend-specific logic.
- Document any new types or DTOs clearly.
- Update this README if you add significant new features or conventions.

## Notes
- Changes here may affect both frontend and backend. Coordinate updates accordingly.
- Keep this package up to date with the needs of all consuming packages.

## DTOs Definition

DTOs (Data Transfer Objects) in this package are defined using [Zod](https://zod.dev/) schemas. Each DTO is a Zod object schema that describes the shape and validation rules for API requests and responses. TypeScript types are automatically inferred from these schemas using `z.infer<typeof SchemaName>`, ensuring type safety and consistency between runtime validation and static typing.

**Pattern:**
- Define a Zod schema for each request or response structure (e.g., `EventBaseSchema`, `RegisterForEventResponseSchema`).
- Export both the schema and the inferred TypeScript type.
- Use Zod's `.merge()` and `.extend()` methods to compose complex DTOs from base schemas.
- For paginated responses, use a helper like `paginateResponse(z.array(Schema))` to wrap arrays with pagination metadata.

**Example:**
```ts
export const RegisterForEventResponseSchema = z.object({
  success: z.boolean(),
});
export type RegisterForEventResponse = z.infer<typeof RegisterForEventResponseSchema>;
```

This approach ensures that validation and type definitions stay in sync, and makes it easy to share DTOs across frontend and backend code.