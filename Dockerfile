FROM node:18-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Set environment defaults for production
ENV NODE_ENV=production
ENV DATA_MODE=mock
ENV NEXT_PUBLIC_DATA_MODE=mock
ENV PORT=5000

# Build Next.js application
RUN npm run build

# Expose ports
EXPOSE 5000
EXPOSE 3000

# Start Next.js server on PORT (defaults to 5000)
CMD ["sh", "-c", "npx next start -p ${PORT:-5000} -H 0.0.0.0"]
