# build stage
FROM node:22-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
EXPOSE 3000

CMD ["yarn", "start"]