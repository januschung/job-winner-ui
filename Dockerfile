FROM node:lts-alpine3.20


WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
CMD [ "npx", "serve", "build" ]