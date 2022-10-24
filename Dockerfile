# compile typescript to normal javascript

FROM node:18-alpine@sha256:828424b660b8274e7dcf6c7447f014406610facf663f38df92c3162a3d29a1db AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:828424b660b8274e7dcf6c7447f014406610facf663f38df92c3162a3d29a1db AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]