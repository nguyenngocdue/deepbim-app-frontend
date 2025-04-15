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
    

    # 🧠 Set heap limit to prevent memory crash
    ENV NODE_OPTIONS="--max-old-space-size=4096"

    # Step 4: specify build mode (beta/prod)
    ARG VITE_MODE=production
    ENV VITE_MODE=$VITE_MODE

    RUN npm run build -- --mode $VITE_MODE
    
    # ------------------------------
    # Stage 2: Serve with Nginx
    # ------------------------------
    FROM nginx:alpine AS production
    
    # Copy nginx config
    COPY .docker_102/nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy built app from previous stage
    COPY --from=build /usr/src/app/dist /usr/share/nginx/html
    
    # Expose the port
    EXPOSE 3003
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    