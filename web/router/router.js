const express = require('express')

const AppController = require('../controller/controller')

const router = express.Router();

router.get('/get_scraped_data', AppController.getScrapedData);

router.post('/start_scrape', AppController.postScrappedDataToDb);

module.exports = router;