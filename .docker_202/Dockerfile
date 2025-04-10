# ------------------------------
# Stage 1: Build Vite App
# ------------------------------
FROM node:20 AS build
WORKDIR /usr/src/app

# Copy only dependency files first for layer cache
COPY package.json package-lock.json ./

# Install deps with compatibility for legacy
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Vite app with increased memory limit
RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build


# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:alpine AS production

# Copy nginx config (remember: context is `..`)
COPY .docker_202/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port you're using
EXPOSE 3003

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
