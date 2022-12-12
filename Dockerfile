# compile typescript to normal javascript

FROM node:18-alpine@sha256:62a6ce21599b3183272e71527c9ce9fae9435195052d358f481eb3d69d3dc6f3 AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:62a6ce21599b3183272e71527c9ce9fae9435195052d358f481eb3d69d3dc6f3 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]