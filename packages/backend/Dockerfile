# builder
FROM node:16-alpine as base
RUN npm install -g pnpm@next-7
ARG POSTGRES_DB
ARG POSTGRES_PASS
ARG POSTGRES_USER
ENV NODE_ENV=development
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_PASS=${POSTGRES_PASS}
ENV POSTGRES_USER=${POSTGRES_USER}
WORKDIR /app
COPY package.json ./

FROM base as dependencies
RUN pnpm install --prod #--frozen-lockfile
RUN cp -R node_modules prod_node_modules
RUN pnpm install #--frozen-lockfile

FROM dependencies as builder
COPY @types ./@types
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
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
