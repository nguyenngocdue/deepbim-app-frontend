# ------------------------------
# Stage 1: Build Vite App
# ------------------------------
    FROM node:20 AS build
    WORKDIR /usr/src/app
    
    # Copy dependencies first for layer cache
    COPY package.json package-lock.json ./
    
    # Install dependencies
    RUN npm install --legacy-peer-deps
    
    # Copy toàn bộ source code
    COPY . .
    
    # Set heap limit
    ENV NODE_OPTIONS="--max-old-space-size=4096"
    
    # Set NODE_ENV for optimization
    ENV NODE_ENV=production
    
    # Mode (beta hoặc production)
    ARG VITE_MODE=production
    ENV VITE_MODE=$VITE_MODE
    
    # Build the app
    RUN npm run build -- --mode $VITE_MODE
    
    # ------------------------------
    # Stage 2: Serve with Nginx
    # ------------------------------
    FROM nginx:alpine AS production
    
    # Copy nginx configuration
    COPY .docker_102/nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy built app from previous stage
    COPY --from=build /usr/src/app/dist /usr/share/nginx/html
    
    # Expose standard HTTP port
    EXPOSE 3003
    
    # Start Nginx in foreground
    CMD ["nginx", "-g", "daemon off;"]
    