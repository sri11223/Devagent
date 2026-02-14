FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create output directory for generated projects
RUN mkdir -p /app/generated-projects

# Start the worker
CMD ["npm", "start"]
