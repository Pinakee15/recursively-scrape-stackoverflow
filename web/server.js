// Set up Http server settings
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const AppRouter = require('./router/router')

// Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use('/', AppRouter)

// Server 
app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});
