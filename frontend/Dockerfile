ARG NODE_VERSION='24.6.0-slim'

# build
FROM node:${NODE_VERSION} AS build

WORKDIR /build

COPY package*.json ./

RUN npm ci --audit=false

COPY ./ ./

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# main
FROM node:${NODE_VERSION}

USER node
WORKDIR /app

COPY --chown=node:node --from=build /build/public ./public
COPY --chown=node:node --from=build /build/.next/standalone ./
COPY --chown=node:node --from=build /build/.next/static ./.next/static

CMD ["node", "server.js"]
