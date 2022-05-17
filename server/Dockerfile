FROM alpine

RUN apk add nodejs
RUN apk add --update nodejs npm
RUN apk add chromium

WORKDIR /usr/src/app

COPY . .
RUN npm ci

CMD ["npm","start"]

