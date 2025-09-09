# Use Node.js image for building the project
FROM node:24-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies without running scripts to prevent automatic build
RUN npm install --ignore-scripts

# Run security audit
RUN npm audit --audit-level=moderate

# Copy the source directory and required files
COPY src ./src
COPY version.config.json ./
COPY tsconfig.json ./

# Build the project
RUN npm run build

# Use a minimal Node.js image for running the project
FROM node:24-alpine AS release

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/version.config.json ./version.config.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install production dependencies
RUN npm ci --ignore-scripts --omit=dev

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S selenium -u 1001

# Change ownership of the app directory
RUN chown -R selenium:nodejs /app
USER selenium

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Set the command to run the server
ENTRYPOINT ["node", "dist/index.js"]