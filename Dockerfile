# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install TensorFlow dependencies
RUN npm install @tensorflow/tfjs-node @tensorflow-models/universal-sentence-encoder

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
