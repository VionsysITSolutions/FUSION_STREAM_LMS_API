FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run dist

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma/
RUN npm install --omit=dev
RUN npx prisma generate
RUN chmod +x ./dist/server.js
EXPOSE 8080
CMD ["node", "./dist/server.js"]
