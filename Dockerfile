# compile typescript to normal javascript

FROM node:18-alpine@sha256:a136ed7b0df71082cdb171f36d640ea3b392a5c70401c642326acee767b8c540 AS builder
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:18-alpine@sha256:a136ed7b0df71082cdb171f36d640ea3b392a5c70401c642326acee767b8c540 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env ./.env
COPY --from=builder /app/build ./build
COPY web ./web

CMD ["dumb-init", "npm", "start"]