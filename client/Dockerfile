# Set docker image
FROM node:9.11.1-alpine

# Set current directory in docker container
WORKDIR /usr/src

# Copy package.json to container and install deps
COPY package*.json ./
RUN npm install --quiet

COPY . .

RUN npm run build
