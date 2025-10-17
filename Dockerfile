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

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/services ./services
COPY --from=builder /app/types.ts ./
COPY --from=builder /usr/local/lib/node_modules/tsx /usr/local/lib/node_modules/tsx
COPY --from=builder /usr/local/bin/tsx /usr/local/bin/tsx

# Expose port
EXPOSE 8000

# Start server
CMD ["tsx", "server/index.ts"]
