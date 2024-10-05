FROM node:18

# Set the working directory in the container
WORKDIR /app

# Set the timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy package.json and package-lock.json or yarn.lock if applicable
COPY ./package*.json ./
COPY ./yarn.lock ./

# Install pm2 globally
RUN npm install pm2@latest -g

# Install the app dependencies using yarn
RUN yarn install

# Copy the app source code to the container
COPY ./ ./

# Expose the port the app will run on
EXPOSE 3020

# Copy PM2 process configuration file
COPY process.json ./

# Start the app using PM2
CMD ["pm2-runtime", "process.json"]
