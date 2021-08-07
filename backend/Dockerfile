FROM node:16-alpine as base

# builder
FROM base as builder
ARG POSTGRES_DB
ARG POSTGRES_PASS
ARG POSTGRES_USER
ENV HUSKY=0
ENV NODE_ENV=development
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_PASS=${POSTGRES_PASS}
ENV POSTGRES_USER=${POSTGRES_USER}
RUN npm config set prepare ""
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY @types ./
COPY jest.config.ts ./
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm run build

# ci
FROM base as ci
ENV CI=true
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
RUN find . -path ./node_modules -prune -o -type f -iname "*.ts" -exec rm -f {} \;
CMD ["npm", "run", "test"]

# development
FROM base as development
ENV NODE_ENV=development
WORKDIR /app
CMD ["npm", "run", "dev"]
