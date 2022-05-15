
const dbClient = require('../dbconnection/postgressconnect')
const crudOperation = require('../services/crud/crud.service');

// Get the scraped questions stored in DB
const getScrapedData = async (req, res)=> {
    const values = await crudOperation.getDataFromDb("SELECT * FROM so_questions;") //await dbClient.pgClient.query("SELECT * FROM so_questions;");
    res.send(values.rows)
}

const postScrappedDataToDb = async (req, res)=>{
    if (!req.body.value) {
        res.send({ error: "Invalid input" });
    }

    return await crudOperation.postDataToDb({})
    // `INSERT INTO 
    // so_questions(que_id , que_url, upvotes, ref_count, total_ans)
    // VALUES(3, 'google.com', 3, 7, 5)`
}

module.exports = {
    getScrapedData,
    postScrappedDataToDb
}

