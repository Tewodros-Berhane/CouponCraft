FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src

EXPOSE 8080
CMD ["node", "src/index.js"]
