# compile typescript to normal javascript

FROM node:18-alpine@sha256:b3f383c13d71066a4e2380d42f4563ac14ac76b3035a5bea4db84209e14665d5 AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:b3f383c13d71066a4e2380d42f4563ac14ac76b3035a5bea4db84209e14665d5 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]