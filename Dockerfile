# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the source code
COPY . .

# Build-time argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3002

# Serve the built frontend
CMD ["serve", "-s", "dist", "-l", "3002"]
