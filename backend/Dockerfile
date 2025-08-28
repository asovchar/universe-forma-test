ARG NODE_VERSION='24.6.0-slim'

# build
FROM node:${NODE_VERSION} as build

WORKDIR /build

COPY package*.json ./

RUN npm ci --audit=false

COPY ./ ./

RUN npm run build

# main
FROM node:${NODE_VERSION}

USER node
WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci --audit=false && npm cache clean --force

COPY --chown=node:node --from=build /build/dist /app/dist

CMD ["node", "dist/main.js"]
