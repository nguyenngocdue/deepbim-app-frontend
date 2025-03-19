# Stage 1: Build Vite App
FROM node:20 AS build
WORKDIR /usr/src/app

# Copy package.json và package-lock.json để cài dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Vite
RUN npm run build --legacy-peer-deps

# Stage 2: Serve với Nginx
FROM nginx:alpine AS production

# Copy file cấu hình Nginx
COPY .docker_202/nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục build từ Stage 1 vào Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 3003
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]