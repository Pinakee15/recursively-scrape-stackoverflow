const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Redis 
const redis = require('redis');
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log("PG ERROR", err));
});

//Express route definitions
app.get("/", (req, res) => {
  res.send("Hi");
});

// get the values
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values);
  redisClient.get('numVisits', function(err, numVisits) {
    numVisitsToDisplay = parseInt(numVisits) + 1;
    console.log("We have done it : ", parseInt(numVisits))
    if (isNaN(numVisitsToDisplay)) {
        numVisitsToDisplay = 1;
    }
   res.send(os.hostname() +': Number of visits is: ' + numVisitsToDisplay);
    numVisits++;
    redisClient.set('numVisits', numVisits);
  });
});

// now the post -> insert value
app.post("/values", async (req, res) => {
  if (!req.body.value) res.send({ working: false });

  pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log("Listening");
});
