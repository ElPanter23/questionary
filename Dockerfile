# Multi-stage build for Question Tool
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci

# Install Angular CLI globally for building
RUN npm install -g @angular/cli

# Copy source code
COPY . .

# Build the Angular application (regular mode)
RUN npm run build

# Build the Angular application (demo-only mode)
RUN npm run build:demo

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built frontend from builder stage (regular mode)
COPY --from=builder /app/client/dist/question-tool ./public

# Copy built frontend from builder stage (demo-only mode)
COPY --from=builder /app/client/dist/question-tool-demo ./public-demo

# Copy backend source
COPY server/ ./server/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S questiontool -u 1001

# Change ownership of the app directory
RUN chown -R questiontool:nodejs /app
USER questiontool

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
