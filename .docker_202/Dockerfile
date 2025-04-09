# Stage 1: Build Vite App
FROM node:20 AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

COPY .docker_202/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 3003
CMD ["nginx", "-g", "daemon off;"]
