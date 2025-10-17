FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY server ./server
COPY services ./services
COPY types.ts ./

# Build (if needed)
RUN npm install -g tsx

FROM node:18-alpine

WORKDIR /app

# Copy package.json first to set module type
COPY --from=builder /app/package*.json ./

# Install tsx globally in production container
RUN npm install -g tsx

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/services ./services
COPY --from=builder /app/types.ts ./

# Expose port
EXPOSE 8000

# Start server
CMD ["tsx", "server/index.ts"]
