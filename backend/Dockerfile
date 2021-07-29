FROM node:16-slim as base

WORKDIR /src
COPY package.json package-lock.json src /src/
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm ci --production
RUN npm run build
COPY . /src
CMD ["npm", "run", "prod"]

FROM base as development
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /src
CMD ["npm", "run", "dev"]
