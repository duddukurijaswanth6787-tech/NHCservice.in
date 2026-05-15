# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy package files and install production-only deps
COPY package*.json ./
RUN npm ci --only=production
# Copy all source files (or just the ones needed for runtime)
COPY . .

EXPOSE 5001
CMD ["node", "server.js"]
