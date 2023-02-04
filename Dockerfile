FROM node:18-alpine@sha256:bc329c7332cffc30c2d4801e38df03cbfa8dcbae2a7a52a449db104794f168a3 AS base
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true


# get staff document
FROM alpine@sha256:f271e74b17ced29b915d351685fd4644785c6d1559dd1f2d4189a5e851ef753a AS staff-document
RUN apk --no-cache add git

ARG GITHUB_AUTH=none

RUN git clone --branch build --recurse-submodules https://${GITHUB_AUTH}@github.com/project-blurple/staff-document.git /staff-document | true
RUN mkdir -p /staff-document/.git
RUN rm -rf /staff-document/.git


# base image for package installation

FROM base AS dep-base
RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./


# install production dependencies

FROM dep-base AS prod-deps
RUN pnpm install --frozen-lockfile --prod


# install all dependencies and build typescript

FROM prod-deps AS ts-builder
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY ./src ./src
RUN pnpm run build


# production image

FROM base

COPY .env* ./
COPY --from=ts-builder /app/build ./build
COPY --from=prod-deps /app/node_modules ./node_modules
COPY ./web ./web
COPY --from=staff-document /staff-document ./web/staff-document
COPY package.json ./

ENV NODE_ENV=production
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
