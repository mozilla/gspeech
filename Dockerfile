FROM node:9

RUN npm install --save @google-cloud/speech body-parser express

RUN mkdir -p /app/gspeech-proxy/
COPY * /app/gspeech-proxy/

# Set the default command
WORKDIR /app/gspeech-proxy
CMD node index.js
