# compile typescript to normal javascript

FROM node:18-alpine@sha256:01814f0652e19db86fc8c361641d387c5cea7759f8de0724b96cc69ca966fd8f AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:01814f0652e19db86fc8c361641d387c5cea7759f8de0724b96cc69ca966fd8f AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]