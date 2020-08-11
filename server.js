//Import Packages
const express = require('express');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//Create express instance and use packages
const app = express();
app.use(errorHandler());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

//Set PORT, start server, and export for testing
const PORT = process.env.PORT || 4000;
app.listen(PORT);
module.exports = app;

