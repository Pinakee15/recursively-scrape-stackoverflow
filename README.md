## Stack overflow recursively scraping sample application

## Node.js, React application with Nginx proxy and Redis and Postgres database

### Note : In current version of project scapping library doesnt work properly so you have spin up code locally for all instances

### How to set up the project
#### - Open redis server on your local using command redis-server (On mac/linux) on default port 6379
#### - Open postgres server on the default port
#### - cd into client and run npm install --save && npm run
#### - cd into server and run npm install -- save && npm run

Project structure:
```
.
├── README.md
├── docker-compose.yml
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
└── server
    ├── Dockerfile
    ├── package.json
    └── app
 └── client
    ├── Dockerfile
    ├── package.json
    └── server.js
    


```
[_docker-compose.yml_](docker-compose.yml)
```
version: "3"
services:
  redis:
    image: 'redislabs/redismod'
    ports:
      - '6379:6379'
  postgres:
    image: "postgres:latest"
    environment:
      - POSTGRES_PASSWORD=postgres_password
    expose:
      - '5432'
    ports:
      - 5432:5432
    # volumes:
    #   - ./postgres-data:/var/lib/postgresql/data
  api:
    restart: on-failure
    build: ./web
    hostname: api
    ports:
      - '81:5000'
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
    
  client:
    restart: on-failure
    build: ./client
    hostname: client
    ports:
      - '82:3000'
  nginx:
    build: ./nginx
    ports:
    - '80:80'
    depends_on:
    - api
    - client





