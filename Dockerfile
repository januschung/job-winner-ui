# Build stage
FROM node:lts-alpine3.20 AS build


WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html

COPY public/config.template.js /usr/share/nginx/html/config.template.js
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
