// Set up Http server settings
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const scrapeData = require('./scrape-web/scrape');
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

pgClient.on("connect", async client => {
    console.log("Connected to data : :")
    await client.query(`CREATE TABLE IF NOT EXISTS so_questions
            (que_id integer PRIMARY KEY, que_url text ,upvotes integer, ref_count integer, total_ans integer);
        `)
  });


// app.get('/get', async function(req, res) {
//     redisClient.get('numVisits', async function(err, numVisits) {
//         numVisitsToDisplay = parseInt(numVisits) + 1;
//         if (isNaN(numVisitsToDisplay)) {
//             numVisitsToDisplay = 1;
//         }
//     //    res.send(': Number of visits is: ' + numVisitsToDisplay);

//         const values = await pgClient.query("SELECT * FROM values");
//         res.send(values);

//         numVisits++;
//         console.log("Redis and postgres working fine together : ", numVisits)
//         redisClient.set('numVisits', numVisits);
//     });
// });

app.get('/get', async function(req, res) {
    console.log("Got the request : : : ",)
    const values = await pgClient.query("SELECT * FROM so_questions;");
    console.log("Values inside databae : ", values.rows)
    res.send(values.rows)
});

scrapeData.scrapeData("https://stackoverflow.com/questions?tab=newest&page=9999")

// app.post("/start_scrape", async (req, res) => {
//     if (!req.body.value) res.send({ working: false });
//     let recursion_depth = req.body.value
//     console.log("This is recursion height : ", recursion_depth)
//     // pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);
//     scrapeData()
  
//     res.send({ working: true });
//   });

app.post("/start_scrape", async (req, res) => {
    if (!req.body.value) res.send({ working: false });
    let recursion_depth = req.body.value
    console.log("This is recursion height : ", recursion_depth)
    pgClient.query(`INSERT INTO 
        so_questions(que_id , que_url, upvotes, ref_count, total_ans)
        VALUES(1, 'google.com', 3, 7, 5)`
    , (err, res)=>{
        console.log("ERROR WHILE INSERTING DATA", err)
    });

    // scrapeData()

    res.send({ working: true });
});


app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});
