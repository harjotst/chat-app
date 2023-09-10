# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . . 

# Build the React app
RUN npm run build

# Install the serve package to serve the built React app
RUN npm install -g serve

# Expose port 3000 (where the app will be accessible)
EXPOSE 3000

# Serve the built React app
CMD ["serve", "-s", "build", "-l", "3000"]
