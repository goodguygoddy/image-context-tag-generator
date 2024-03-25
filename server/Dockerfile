FROM node:20

WORKDIR /

COPY package*.json ./

RUN npm install --only=production

COPY / .

EXPOSE 3000

CMD npm run seed:production && npm run start

