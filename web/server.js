// Set up Http server settings
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Middlewares

app.use(bodyParser.json());

keys = {
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT
}

// Redis setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});


redisClient.set("myKey", "my value", function(err) {
    if (err) throw err;
})

// Postgres set up
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


app.get('/get', async function(req, res) {
    redisClient.get('numVisits', async function(err, numVisits) {
        numVisitsToDisplay = parseInt(numVisits) + 1;
        if (isNaN(numVisitsToDisplay)) {
            numVisitsToDisplay = 1;
        }
    //    res.send(': Number of visits is: ' + numVisitsToDisplay);

        const values = await pgClient.query("SELECT * FROM values");
        res.send(values);

        numVisits++;
        console.log("Redis and postgres working fine together : ", numVisits)
        redisClient.set('numVisits', numVisits);
    });
});

app.post("/values", async (req, res) => {
    if (!req.body.value) res.send({ working: false });
  
    pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);
  
    res.send({ working: true });
  });



app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});
