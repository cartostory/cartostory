FROM node:16-alpine as base

# builder
FROM base as builder
ENV HUSKY=0
ENV CI=true
ENV NODE_ENV=development
RUN npm config set prepare ""

WORKDIR /app
COPY package.json package-lock.json global.d.ts jest.config.ts tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm ci

# test
FROM builder as test
WORKDIR /app
COPY --from=builder /app/dist ./
CMD ["npm", "run", "test"]

#WORKDIR /src
#COPY package.json package-lock.json src /src/
#EXPOSE 3000

#FROM base as production
#ENV NODE_ENV=production
#RUN npm ci --production
#RUN npm run build
#COPY . /src
#CMD ["npm", "run", "prod"]

#FROM base as development
#ENV NODE_ENV=development
#RUN npm install -g nodemon && npm install
#COPY . /src
#CMD ["npm", "run", "dev"]
