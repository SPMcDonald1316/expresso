//Create express router instance
const express = require('express');
const apiRouter = express.Router();

//Import router instances
const employeesRouter = require('./employees');
const menusRouter = require('./menus');

//Mount router instances at api path
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);

module.exports = apiRouter;