FROM node:12 AS node-builder
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci

FROM node:12-slim
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
COPY --chown=node:node --from=node-builder /home/node/app/node_modules/ ./node_modules/
CMD [ "/usr/local/bin/node", "index.js" ]
