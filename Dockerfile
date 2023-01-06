# compile typescript to normal javascript

FROM node:18-alpine@sha256:ab366174466e326e413d56c2811c45a38b9602415d7a490a9931822570870db6 AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:ab366174466e326e413d56c2811c45a38b9602415d7a490a9931822570870db6 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]