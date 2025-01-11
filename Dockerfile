# Stage 1: Build Stage
FROM --platform=linux/amd64 node:18-alpine3.20 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies required by node-gyp
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime Stage
FROM --platform=linux/amd64 node:18-alpine3.20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules



# Expose the application port
EXPOSE 8080

# Define the command to run the application
CMD ["node", "dist/src/main.js"]
