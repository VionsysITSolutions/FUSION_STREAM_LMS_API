FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run dist

FROM node:20 AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x ./start.sh
ENV NODE_ENV=production
EXPOSE 8080
CMD ["./start.sh"]
CMD ["node", "dist/server.js"]
