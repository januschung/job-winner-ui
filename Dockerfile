FROM node:lts-alpine3.17


WORKDIR /app
COPY . .
RUN npm ci 
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
CMD [ "npx", "serve", "build" ]