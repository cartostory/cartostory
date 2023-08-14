# builder
FROM node:18-alpine as base
RUN npm install -g pnpm@next-7
WORKDIR /app
COPY package.json ./

FROM base as dependencies
RUN pnpm install #--frozen-lockfile

FROM dependencies as builder
COPY public ./public
COPY index.html ./
COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
RUN pnpm build

# ci
FROM builder as ci
WORKDIR /ci
ENV CI=true
ENV NODE_ENV=production
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
RUN true
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
CMD ["pnpm", "test"]

# development
FROM base as development
ENV NODE_ENV=development
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
ENV NODE_ENV=development
USER node
CMD ["pnpm", "dev"]
