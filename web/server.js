// Set up Http server settings
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const scrapeData = require('./scrape-web/scrape');
const AppRouter = require('./router/router')

// Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use('/', AppRouter)


// Redis setup
// const redis = require('redis');
// const redisClient = redis.createClient({
//   host: 'redis',
//   port: 6379
// });


// redisClient.set("myKey", "my value", function(err) {
//     if (err) throw err;
// })
// Postgres set up


// Postgres setup 
// const { Pool } = require("pg");
// const { val } = require('cheerio/lib/api/attributes');
// const pgClient = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "pinakee",
//   port: "5432"
// });

// tableName = 'so_questions'

// pgClient.on("connect", async client => {
//     console.log("Connected to data : :")
//     await client.query(`CREATE TABLE IF NOT EXISTS so_questions
//             (que_id integer PRIMARY KEY, que_url text ,upvotes integer, ref_count integer, total_ans integer);
//         `)
//   });


// app.get('/get', async function(req, res) {
//     console.log("Got the request : : : ",)
//     const values = await pgClient.query("SELECT * FROM so_questions;");
    
//     console.log("Values inside databae : ", values.rows)
//     // redisClient.get('numVisits', async function(err, numVisits) {
//     //     numVisitsToDisplay = parseInt(numVisits) + 1;
//     //     if (isNaN(numVisitsToDisplay)) {
//     //         numVisitsToDisplay = 1;
//     //     }
//     //     const values = await pgClient.query("SELECT * FROM values");
//     //     res.send(values);

//     //     numVisits++;
//     //     console.log("Redis and postgres working fine together : ", numVisits)
//     //     redisClient.set('numVisits', numVisits);
//     // });
//     res.send(values.rows)
// });

// scrapeData.scrapeOuestions("https://stackoverflow.com/questions?tab=newest&page=9999")

// app.post("/start_scrape", async (req, res) => {
//     if (!req.body.value) res.send({ working: false });
//     let recursion_depth = req.body.value
//     console.log("This is recursion height : ", recursion_depth)
//     pgClient.query(`INSERT INTO 
//         so_questions(que_id , que_url, upvotes, ref_count, total_ans)
//         VALUES(3, 'google.com', 3, 7, 5)`
//     , (err, res)=>{
//         console.log("ERROR WHILE INSERTING DATA", err)
//     });  
//     res.send({ working: true });
//   });


app.listen(4000, function() {
    console.log('Web application is listening on port 5000');
});
