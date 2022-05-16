const express = require('express')

const AppController = require('../controller/app.controller')

const router = express.Router();

router.get('/get_scraped_data', AppController.getScrapedData);

// router.post('/start_scrape', AppController.postScrappedDataToDb);
router.post('/start_scrape', AppController.startWebScraping);

module.exports = router;