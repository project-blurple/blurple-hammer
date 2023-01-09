# compile typescript to normal javascript

FROM node:18-alpine@sha256:bf6dfc7d9676e690fed98ce91477d609b5f4c5e13c91d22b85b9be9e0d828ffe AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:bf6dfc7d9676e690fed98ce91477d609b5f4c5e13c91d22b85b9be9e0d828ffe AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]