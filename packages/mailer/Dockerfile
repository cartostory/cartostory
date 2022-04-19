# builder
FROM node:16-alpine as base
RUN npm install -g pnpm@next-7
WORKDIR /app
COPY package.json ./

FROM base as dependencies
RUN pnpm install --production #--frozen-lockfile
RUN cp -R node_modules prod_node_modules
RUN pnpm install #--frozen-lockfile

FROM dependencies as builder
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

# ci
FROM builder as ci
WORKDIR /ci
ENV CI=true
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
RUN true
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
CMD ["pnpm", "test"]

# development
FROM base as development
ENV NODE_ENV=development
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["pnpm", "dev"]
