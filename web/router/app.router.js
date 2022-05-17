const express = require('express')

const AppController = require('../controller/app.controller')

const router = express.Router();

router.get('/get_scraped_data', AppController.getScrapedData);

router.post('/start_scraping', AppController.startWebScraping);

router.get('/get_last_question' , AppController.getLastQuestion);

router.post("/resume_scraping", AppController.resumeScraping);


module.exports = router;