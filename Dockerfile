FROM node:alpine
LABEL authors="nelmin"

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["npm", "run", "start"]
