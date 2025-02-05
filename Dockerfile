# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose API port
EXPOSE 3000

# Install pgvector dependencies for PostgreSQL
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev postgresql-server-dev-15 git && \
    git clone https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install && \
    rm -rf pgvector

# Start the application
CMD ["node", "dist/server.js"]
