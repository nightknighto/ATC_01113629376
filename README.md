# Events Platform Monorepo

A full-stack event booking platform built with modern technologies, organized as a monorepo for seamless development and integration. This system enables users to browse, register, and manage events, while providing admins with robust management tools.

---

## Monorepo Architecture

This repository is managed with **Turborepo** and contains three main packages:

- **Frontend** (`packages/frontend`): User-facing web application built with React, TypeScript, Vite, and Tailwind CSS.
- **Backend** (`packages/backend`): RESTful API built with Node.js, Express, TypeScript, and Prisma ORM (PostgreSQL).
- **Shared** (`packages/shared`): Common TypeScript types, DTOs, and Zod schemas shared between frontend and backend.

Inter-package dependencies are managed via local imports and aliases (e.g., `@events-platform/shared`).

---

## Project Structure

```
.
├── packages/
│   ├── frontend/   # React app (user interface)
│   ├── backend/     # Express API backend
│   └── shared/     # Shared types, DTOs, and utilities
├── docker-compose.yml
├── turbo.json      # Turborepo config
├── package.json    # Monorepo scripts and dependencies
└── ...
```

---

## System Features

- **User Authentication**: Register, login, logout (JWT-based)
- **Event Management**: Create, update, delete, and browse events
- **Event Registration**: Users can register/unregister for events
- **Admin Dashboard**: Manage users, events, and view analytics
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **API Documentation**: Swagger UI for backend API
- **File Uploads**: Event images via Azure Blob Storage
- **Validation**: Zod schemas for type-safe validation
- **Pagination**: Efficient handling of large event lists
- **Testing**: Automated tests for backend reliability
- **Rate Limiting**: Protects API from abuse

---

## Package Details

### 1. Frontend (`packages/frontend`)
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Bootstrap, Axios, React Router v6
- **Features**:
  - Event browsing, search, and filtering
  - Event details and registration
  - User authentication (JWT)
  - Admin dashboard for event/user management
  - Responsive design
  - Error handling and user feedback
- **Structure**:
  - `src/components/`: Reusable UI components
  - `src/pages/`: Route-level components
  - `src/services/`: API calls
  - `src/hooks/`: Custom hooks
  - `src/utils/`: Utility functions
- **Integration**: Consumes backend API and shared types/DTOs

### 2. Backend (`packages/backend`)
- **Tech Stack**: Node.js, Express, TypeScript, Prisma (PostgreSQL), JWT, bcryptjs, Zod, Azure Blob Storage
- **Features**:
  - RESTful API for all event and user operations
  - JWT authentication and role-based access
  - Event CRUD and registration endpoints
  - Admin endpoints for analytics and management
  - File uploads (event images)
  - Swagger UI for API docs
  - Automated tests and error handling
  - Rate limiting and pagination
- **Structure**:
  - `src/middleware/`: Auth, error handling, etc.
  - `src/routes/`: API route handlers
  - `src/controllers/`: Business logic
  - `src/services/`: Database and external integrations
  - `prisma/`: Schema and migrations
- **Integration**: Exposes API consumed by frontend; uses shared DTOs/types

### 3. Shared (`packages/shared`)
- **Contents**:
  - TypeScript types and interfaces
  - DTOs (Data Transfer Objects) defined with Zod
  - Utility functions (if any)
- **Usage**: Imported by both frontend and backend for type safety and validation consistency
- **Guidelines**:
  - Keep code generic and free of package-specific logic
  - Document new types/DTOs
  - Coordinate changes that affect multiple packages

---

## Integration & Communication

- **API Communication**: Frontend communicates with backend via REST API, using Axios and the base URL defined in environment variables.
- **Type Safety**: Shared DTOs and types ensure consistent data structures and validation across the stack.
- **Authentication**: JWT tokens are issued by the backend and used by the frontend for protected routes and actions.
- **File Uploads**: Event images are uploaded from the frontend and stored in Azure Blob Storage via backend endpoints.

---

## Development & Setup

There are ways: Through Docker Compose, or locally.

## Docker Compose Setup (Recommended)

### Prerequisites
- Docker

### 1. Clone the repository
```sh
git clone <repository-url>
cd Events-Platform-Fullstack
```

### 2. Set up environment variables
- **Backend**: `packages/backend/.env` (see `.env.example`)

> If you dont have an azure account, don't add images when creating events (It is not required)

### 3. Start the docker compose
```sh
docker compose up
```

> Add `--watch` to the command to enable live reloading for the backend and frontend services.

### 4. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/docs](http://localhost:3001/docs)
- Prisma Studio: [http://localhost:5555](http://localhost:5555)


> To see and access the admin database, you need to open the database and make yourself an admin. This can be done through the Prisma Studio.

## Local Development Setup

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL database
- npm or yarn

### 1. Clone the repository
```sh
git clone <repository-url>
cd Events-Platform-Fullstack
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
- **Backend**: `packages/backend/.env` (see `.env.example`)

> If you dont have an azure account, don't add images when creating events (It is not required)

### 4. Set up the database
- Create a PostgreSQL database (you can use the docker compose: `docker compose up database`)
- Update connection string in `packages/backend/.env`

### 5. Generate Prisma client and push schema
```sh
cd packages/backend
npm run prisma:generate
npm run prisma:push
```

### 6. Start development servers
```sh
npm run dev # In the root
```

### 7. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

> To see and access the admin database, you need to open the database and make yourself an admin. This can be done through the Prisma Studio. `npm run prisma:studio # In the backend package`

---

## Additional Notes
- **Swagger API Docs**: Visit `/docs` on the backend backend for interactive API documentation
- **Shared Package**: Changes here may affect both frontend and backend; coordinate updates accordingly
- **Testing**: Run backend tests with `npm test` in `packages/backend`
- **Monorepo Management**: Use Turborepo for efficient builds and task running

---

For more details, see the README in each package directory.