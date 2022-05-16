// Set up Http server settings
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const AppRouter = require('./router/app.router')
const PORT = 5000;

// Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use('/', AppRouter)

// Server 
app.listen(PORT, function() {
    console.log(`Web application is listening on port ${PORT}`);
});
