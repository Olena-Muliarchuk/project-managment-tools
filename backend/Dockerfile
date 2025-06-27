# Dockerfile for Node.js Express backend with Prisma
# 1. Installs dependencies
# 2. Generates Prisma client
# 3. Starts server on port 5000

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
