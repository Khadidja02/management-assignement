# my-app/Dockerfile
FROM node:19.7

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY ./my-app/package.json my-app/package-lock.json ./

ENV NPM_CONFIG_FETCH_TIMEOUT=60000

# Install dependencies
RUN npm install --legacy-peer-deps --force

# Copy the rest of the React app code
COPY ./my-app/ ./

# Build the React app
RUN npm run build

# Install a simple static file server to serve the React build
RUN npm install -g serve

# Expose port 3000 for the React app
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build"]
