# builder
FROM node:16-alpine as base
ARG POSTGRES_DB
ARG POSTGRES_PASS
ARG POSTGRES_USER
ENV NODE_ENV=development
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_PASS=${POSTGRES_PASS}
ENV POSTGRES_USER=${POSTGRES_USER}
WORKDIR /app
COPY package.json ./
RUN sed -i '/prepare/d' ./package.json
COPY package-lock.json ./

FROM base as dependencies
RUN npm ci --only=production
RUN cp -R node_modules prod_node_modules
RUN npm ci

FROM dependencies as builder
COPY @types ./@types
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm run build

# ci
FROM builder as ci
WORKDIR /ci
ENV CI=true
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
RUN true
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "test"]

# development
FROM base as development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
