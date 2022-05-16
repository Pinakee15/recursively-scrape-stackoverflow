
const dbClient = require('../dbconnection/postgress.dbconnection')
const crudOperation = require('../services/crud/crud.service');
const scrape = require("../services/webscrape/app.webscrape")

// Get the scraped questions stored in DB
const getScrapedData = async (req, res)=> {
    const values = await crudOperation.getDataFromDb("SELECT * FROM so_questions;") //await dbClient.pgClient.query("SELECT * FROM so_questions;");
    res.send(values.rows)
}

const startWebScraping = async (req, res)=>{
    scrape.scrapeOuestions("https://stackoverflow.com/questions");
}

const postScrappedDataToDb = async (req, res)=>{    
    let val = req.body.value;
    console.log("This is the value : ", val)
    if (!val) {
        res.send({ error: "Invalid input" });
    }

    return await crudOperation.postDataToDb(
        {question_id : val,
         question_url : 'fb.com', 
         total_upvotes : 10,
         reference_count: 0,
         total_answers: 3}
        )
}

module.exports = {
    getScrapedData,
    postScrappedDataToDb,
    startWebScraping
}

