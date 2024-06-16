FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

ENV NODE_ENV=production

CMD ["serve", "-s", "build", "-l", "3000"]