# Specify a base image
FROM node:18

# Install build tools to compile bcrypt and install Redis
# RUN apt-get update && apt-get install -y \
#     make \
#     g++ \
#     python3

# Set a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# # Rebuild bcrypt to match the container's architecture
# RUN npm rebuild bcrypt --build-from-source

# Copy other source files
COPY . .

# Start app
CMD node app.js
