FROM nginx:alpine AS production

# Copy nginx config
COPY .docker_102/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port chuẩn của nginx
EXPOSE 3003

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
