FROM node:20 AS dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]