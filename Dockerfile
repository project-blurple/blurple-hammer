FROM node:18-alpine@sha256:dc64dfcf979ceb47254c9136b4cac3411f045d0fce23d35e147238b57c34af81 AS base
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true


# install prod dependencies

FROM base AS deps
RUN npm install -g pnpm@8

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod


# install all dependencies and build typescript

FROM deps AS ts-builder
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY ./src ./src
RUN pnpm run build


# production image

FROM base

COPY .env* ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=ts-builder /app/build ./build
COPY ./web ./web
COPY package.json ./

ENV NODE_ENV=production
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
