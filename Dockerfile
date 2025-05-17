# Stage: base
# This is the shared base stage that all other stages inherit or copy from.
# It copies the package.json files from the root, shared, and chosen app directories.
FROM node:22.11.0-alpine AS base

# TARGET_APP decides which app to build dynamically.
# It would be set to either frontend, backend, or platform.
ARG TARGET_APP
ENV TARGET_APP=${TARGET_APP}

WORKDIR /monorepo

# Copy the root package.json and package-lock.json files
COPY package*.json ./

# Copy the shared packages' package.json file
COPY packages/shared/package*.json ./packages/shared/

# Copy the chosen app's package.json file
COPY packages/${TARGET_APP}/package*.json ./packages/${TARGET_APP}/


# --------------------------------------------
# --------------------------------------------
# Stage: Development
# This stage installs the development dependencies and copies the shared packages and the chosen app.
FROM base AS base-dev

# Install the dependencies with dev dependencies
RUN --mount=type=cache,target=/root/.npm npm install --force

# Copy the shared packages
COPY packages/shared ./packages/shared

# Copy the chosen app
COPY packages/${TARGET_APP} ./packages/${TARGET_APP}

# Build the shared packages
RUN npm run build -w ./packages/shared

ENV NODE_ENV=development

# Set the base command to run the chosen app
CMD ["sh", "-c", "npm run dev:docker"]

# --------------------------------------------
# Stage: Frontend development
# Make a copy of the base stage and continue building on top of it.
FROM base-dev AS frontend-dev

# Build the frontend app
RUN npm run build -w ./packages/${TARGET_APP}

EXPOSE 5173

# --------------------------------------------
# Stage: Backend development
# Make a copy of the base stage and continue building on top of it.
FROM base-dev AS backend-dev

# Generate Prisma client
RUN cd ./packages/backend && npx prisma generate

# Build the backend app
RUN npm run build -w ./packages/backend

EXPOSE 3000
