//Create express router instance
const express = require('express');
const employeesRouter = express.Router();

//Import database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Route Parameter


//Routes
employeesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (err, employees) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({employees: employees});
    }
  });
});

employeesRouter.post('/', (req, res, next) => {
  const employee = req.body.employee;
  if (!employee.name || !employee.position || !employee.wage) {
    return res.sendStatus(400);
  }
  const isEmployed = employee.isCurrentEmployee === 0 ? 0 : 1;
  db.run('INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)', {
    $name: employee.name,
    $position: employee.position,
    $wage: employee.wage,
    $isCurrentEmployee: isEmployed
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (err, employee) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({employee: employee});
        }
      });
    }
  });
});

//Export router
module.exports = employeesRouter;