# Dockerfile for Node.js Express backend with Prisma and Prisma Studio
# 1. Installs dependencies
# 2. Generates Prisma client
# 3. Starts server on port 5000
FROM node:18-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5002

CMD ["sh", "-c", "npm run db:deploy && npm start"]
