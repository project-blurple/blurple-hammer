FROM node:18-alpine@sha256:0fe7402d11d8c85474c6ec6f9c9c8048cd0549c95535832b7f0735a4b47690a5 AS base
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
