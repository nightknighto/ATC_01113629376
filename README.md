# Events Platform - Full Stack Application

A full-stack event booking platform built with React, Express, and PostgreSQL. This application allows users to create, browse, and register for events.

## Project Structure

This is a monorepo managed with Turborepo, containing the following packages:

- `client`: React frontend with Tailwind CSS
- `server`: Express backend with Prisma ORM
- `shared`: Shared TypeScript types and Zod schemas

## Features

- User authentication (register, login, logout)
- Event management (create, read, update, delete)
- Event registration
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd events-platform-fullstack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database and update the connection string in `packages/server/.env`.

### 4. Generate Prisma client

```bash
cd packages/server
npm run prisma:generate
```

### 5. Run database migrations

```bash
cd packages/server
npm run prisma:migrate
```

### 6. Start the development servers

From the root directory:

```bash
npm run dev
```

This will start both the client and server in development mode.

- Client: http://localhost:3000
- Server: http://localhost:3001

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `POST /api/events/:id/register` - Register for an event
- `DELETE /api/events/:eventId/register/:userId` - Cancel registration

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Technologies Used

### Frontend

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcryptjs

### Shared

- TypeScript
- Zod (schema validation)

## Project Structure

```
├── packages/
│   ├── client/            # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── contexts/    # React contexts
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API services
│   │   │   ├── App.tsx      # Main App component
│   │   │   └── main.tsx     # Entry point
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── server/            # Express backend
│   │   ├── prisma/         # Prisma schema and migrations
│   │   ├── src/
│   │   │   ├── middleware/  # Express middleware
│   │   │   ├── routes/      # API routes
│   │   │   └── index.ts     # Entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/            # Shared types and schemas
│       ├── src/
│       │   └── index.ts     # Zod schemas
│       ├── package.json
│       └── tsconfig.json
├── package.json           # Root package.json
└── turbo.json             # Turborepo configuration
```

## Future Enhancements

- Event categories and filtering
- User profiles with avatars
- Event images and galleries
- Email notifications
- Payment integration for paid events
- Admin dashboard

## License

MIT