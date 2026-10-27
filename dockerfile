# ==========================================
# Stage 1: Build the application
# ==========================================
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install native build tools required for packages like argon2 (node-gyp, python3, make, g++)
RUN apk add --no-cache python3 make g++

# Copy dependency definition files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Compile TypeScript code to JavaScript (outputs to /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Run the application in production
# ==========================================
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Install python3 and build tools in the runner stage if runtime compilation is needed, 
# or keep them if native modules require them to execute.
RUN apk add --no-cache python3 make g++

# Set environment variable to production
ENV NODE_ENV=production

# Copy dependency definition files
COPY package*.json ./

# Install only production dependencies (using --omit=dev as recommended by npm)
RUN npm ci --omit=dev

# Copy the compiled build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main"]