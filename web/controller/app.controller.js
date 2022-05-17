
const dbClient = require('../dbconnection/postgress.dbconnection')
const crudOperation = require('../services/crud/crud.service');
const scrape = require("../services/webscrape/app.webscrape")

// Get the scraped questions stored in DB
const getScrapedData = async (req, res)=> {
    let query = "SELECT * FROM so_questions;"
    const values = await crudOperation.getDataFromDb(query) //await dbClient.pgClient.query("SELECT * FROM so_questions;");
    res.send(values.rows)
}

const startWebScraping = async (req, res)=>{
    let recursionDepth = req.body.value;
    scrape.scrapeOuestions("https://stackoverflow.com/questions" , recursionDepth , false);
}

const resumeScraping = async (req, res)=>{
    let recursionDepth = req.body.value;
    let question = await getLastQuestion(req,res);
    let url = question?.que_url;
    console.log("start scraping ..")
    scrape.scrapeOuestions(url, recursionDepth , true);
    // scrape.scrapeOuestions("https://stackoverflow.com/questions" , recursionDepth);
}

const deleteAQuestion = async(req,res)=>{
    return await crudOperation.deleteAData({})
}

const getLastQuestion = async(req, res)=>{
    query = `
        select * from so_questions
        order by timestamp desc limit 1;
    `
    const lastQuestion = await crudOperation.getDataFromDb(query)
    console.log("THis is last quesiton : ", lastQuestion.rows);
    return lastQuestion.rows[0];
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
    startWebScraping,
    deleteAQuestion,
    getLastQuestion,
    resumeScraping
}

