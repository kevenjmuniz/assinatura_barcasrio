
# Use a Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Expose port for a simple static server
EXPOSE 8080

# Use a simple static server to serve the files
RUN npm install -g serve

# Start the static server
CMD ["serve", "-s", "dist", "-l", "8080"]
