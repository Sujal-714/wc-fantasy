#Stgae 1 : Builder

FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src

#Compile TS to JS
RUN npm run build

#Stage 2 : Production

FROM node:20-alpine as production

WORKDIR /app

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node","dist/index.js"]