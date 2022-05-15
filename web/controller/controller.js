
const dbClient = require('../dbconnection/postgressconnect')
const crudOperation = require('../services/crud/crud.service');
const scrape = require("../services/scrape-web/scrape")

// Get the scraped questions stored in DB
const getScrapedData = async (req, res)=> {
    const values = await crudOperation.getDataFromDb("SELECT * FROM so_questions;") //await dbClient.pgClient.query("SELECT * FROM so_questions;");
    res.send(values.rows)
}

const startWebScraping = async (req, res)=>{
    scrape.scrapeOuestions("https://stackoverflow.com/questions");
}

const postScrappedDataToDb = async (req, res)=>{
    if (!req.body.value) {
        res.send({ error: "Invalid input" });
    }

    return await crudOperation.postDataToDb({})
}

module.exports = {
    getScrapedData,
    postScrappedDataToDb,
    startWebScraping
}

