const { Pool } = require("pg");
const keys = require('../env/development.env');

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
  });

// Set up the App table if it doesnt exist
pgClient.on("connect", async client => {
    console.log("Connected to data : :")
    await client.query(`CREATE TABLE IF NOT EXISTS so_questions
            (que_id integer PRIMARY KEY, que_url text ,upvotes integer, ref_count integer, total_ans integer, timestamp timestamp);
        `)
  });

module.exports = {
    pgClient
}

