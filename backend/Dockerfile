
FROM node:22-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install


CMD ["npm", "start"]