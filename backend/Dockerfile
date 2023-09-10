# Specify a base image
FROM node:18-alpine

# Install build tools to compile bcrypt and install Redis
RUN apk add --no-cache make gcc g++ python3 redis

# Set a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy other source files
COPY . .

# Start Redis server and then your app
CMD redis-server --daemonize yes && node app.js
