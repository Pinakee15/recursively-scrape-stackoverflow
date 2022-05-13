FROM node:16-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk add chromium

WORKDIR /usr/src/app

# COPY package.json package-lock.json ./
# COPY scrape-web ./
COPY . .
RUN npm ci
# COPY ./server.js ./

CMD ["npm","start"]
