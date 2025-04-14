FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g @nestjs/cli


COPY . .

RUN chmod +x wait-for-postgres.sh

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
