FROM node:20

WORKDIR /chatApp

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "node", "app.js" ]