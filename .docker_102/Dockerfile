FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Step 4: specify build mode (beta/prod)
ARG VITE_MODE=production
ENV VITE_MODE=$VITE_MODE

# Step 6: build Vite app with the correct mode
RUN npm run build -- --mode $VITE_MODE

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist .
EXPOSE 3003
CMD ["serve", "-s", ".", "-l", "3000"]
