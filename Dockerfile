FROM node:20-alpine

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the project files
COPY . .

# Set build-time arguments
ARG NEXT_PUBLIC_ADMIN_API_URL
ARG NEXT_PUBLIC_HOLDEM_WS

# Set environment variables for build time
ENV NEXT_PUBLIC_ADMIN_API_URL=$NEXT_PUBLIC_ADMIN_API_URL
ENV NEXT_PUBLIC_HOLDEM_WS=$NEXT_PUBLIC_HOLDEM_WS

# Build the app with environment variables
RUN yarn build

EXPOSE 3000 3020

CMD ["yarn", "start"]
