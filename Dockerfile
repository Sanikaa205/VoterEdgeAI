## Production-ready single-container Dockerfile
## Builds the frontend, installs backend deps, and serves the SPA via Express

FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package files for frontend and backend
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/

# Install frontend deps and build
WORKDIR /usr/src/app/frontend
RUN npm install --silent
COPY frontend/ .
RUN npm run build

# Build final image with only production deps
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Copy backend sources
COPY backend/ ./backend/

# Copy production node_modules for backend
WORKDIR /usr/src/app/backend
RUN npm install --omit=dev --silent

# Copy built frontend to /usr/src/app/frontend/dist
WORKDIR /usr/src/app
RUN mkdir -p frontend
COPY --from=build /usr/src/app/frontend/dist ./frontend/dist

# Set working dir to backend and expose port
WORKDIR /usr/src/app/backend
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Ensure we don't accidentally commit secrets in image; read from env at runtime

# Start the server
CMD ["node", "server.js"]
