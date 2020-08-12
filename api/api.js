//Create express router instance
const express = require('express');
const apiRouter = express.Router();

//Import router instances
const employeesRouter = require('./employees');

//Mount router instances at api path
apiRouter.use('/employees', employeesRouter);

module.exports = apiRouter;