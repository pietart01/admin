# Use Node.js LTS as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the project files
COPY . .

# Build the app
RUN yarn build

# Expose the port
EXPOSE 3000 3020

# Start the app
CMD ["yarn", "start"]
