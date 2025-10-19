# Build stage
FROM node:current-alpine3.22 AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci --omit=dev || npm install

# Copy source code
COPY . .

# Build application with Turbopack
RUN npm run build

# Runtime stage
FROM node:current-alpine3.22

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install production dependencies only
RUN npm ci --omit=dev --prefer-offline || npm install --omit=dev

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js server
CMD ["npm", "start"]
