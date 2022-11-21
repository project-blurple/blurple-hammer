# compile typescript to normal javascript

FROM node:18-alpine@sha256:9eff44230b2fdcca57a73b8f908c8029e72d24dd05cac5339c79d3dedf6b208b AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:9eff44230b2fdcca57a73b8f908c8029e72d24dd05cac5339c79d3dedf6b208b AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]