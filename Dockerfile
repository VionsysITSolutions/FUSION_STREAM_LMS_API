FROM node:20 AS builder
WORKDIR /app

# Install dependencies and generate Prisma client
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy the rest of the source code and build
COPY . .
RUN npm run dist

# Production image
FROM node:20 AS production
WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/start.sh ./start.sh

# Make sure start.sh is executable
RUN chmod +x ./start.sh

ENV NODE_ENV=production
EXPOSE 8080

CMD ["./start.sh"]