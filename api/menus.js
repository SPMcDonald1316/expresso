//Instantiate router
const express = require('express');
const menusRouter = express.Router();

//Import database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');



module.exports = menusRouter;
