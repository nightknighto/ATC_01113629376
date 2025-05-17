# Events Platform Frontend

## Overview
This is the frontend application for the Events Platform, providing a modern, responsive interface for users to browse events, register, manage their registrations, and for admins to manage events and users. The frontend is built with a modern JavaScript framework and communicates with the backend API for all data operations.

## Features
- Event browsing with search and filtering
- Event details view
- User registration and authentication (JWT-based)
- Event registration and cancellation
- Admin dashboard for event and user management
- Pagination for event lists
- Responsive design for mobile and desktop
- Error handling and user feedback

## Architecture
- **Framework:** React 18 with TypeScript
- **State Management:** React Context API
- **Routing:** React Router v6
- **Styling:** Tailwind CSS and React Bootstrap
- **API Communication:** Axios for REST API requests
- **Build Tool:** Vite

## Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components (routes)
│   ├── hooks/           # Custom React/Vue hooks
│   ├── services/        # API calls and business logic
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app entry
│   └── main.tsx         # App bootstrap
├── public/              # Static assets
├── package.json         # Project metadata and scripts
├── tailwind.config.js   # Tailwind CSS config
├── vite.config.ts       # Vite build config
└── ...
```

## Getting Started
### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Backend API running (see backend README)

### Installation
1. Navigate to the frontend directory:
   ```sh
   cd packages/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Environment Variables
Create a `.env` file in the root of the frontend directory. Example:
```
VITE_API_BASE_URL=http://localhost:3001
```
- `VITE_API_BASE_URL`: The base URL for the backend API.

### Running the Development Server
```sh
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:3000](http://localhost:3000) by default.

## How It Works
- The frontend communicates with the backend API using the base URL defined in the environment variables.
- Authentication is handled via JWT tokens stored in local storage or cookies.
- Protected routes and admin features require a valid token.
- All event and registration data is fetched from the backend.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## Troubleshooting
- **API errors:** Ensure the backend server is running and the API base URL is correct.
- **Authentication issues:** Check token validity and expiration.
- **Styling issues:** Make sure Tailwind CSS is properly configured.