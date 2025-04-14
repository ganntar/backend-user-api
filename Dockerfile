FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN chmod +x wait-for-postgres.sh

RUN npm run build && ls -la dist

EXPOSE 3000

CMD ["node", "dist/src/main"]
