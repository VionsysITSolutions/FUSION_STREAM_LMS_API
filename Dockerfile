FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
CMD ["npm","run","dev"]
