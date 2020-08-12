//Create router instance
const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});

//Import SQLite and database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Router parameter
timesheetsRouter.param('timesheetId', (req, res, next, id) => {
  db.get(`SELECT * FROM Timesheet WHERE id = ${id}`, (err, timesheet) => {
    if (err) {
      next(err);
    } else if (timesheet) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Routes
timesheetsRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId}`, (err, timesheets) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({timesheets: timesheets});
    }
  });
});

timesheetsRouter.post('/', (req, res, next) => {
  const timesheet = req.body.timesheet;
  if (!timesheet.hours || !timesheet.rate || !timesheet.date) {
    return res.sendStatus(400);
  }
  db.run('INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)', {
    $hours: timesheet.hours,
    $rate: timesheet.rate,
    $date: timesheet.date,
    $employeeId: req.params.employeeId
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`, (err, timesheet) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({timesheet: timesheet});
        }
      });
    }
  });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const timesheet = req.body.timesheet;
  if (!timesheet.hours || !timesheet.rate || !timesheet.date) {
    return res.sendStatus(400);
  }
  db.run('UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date WHERE id = $id', {
    $hours: timesheet.hours,
    $rate: timesheet.rate,
    $date: timesheet.date,
    $id: req.params.timesheetId
  }, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE id = ${req.params.timesheetId}`, (err, timesheet) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({timesheet: timesheet});
        }
      });
    }
  });
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
  db.run(`DELETE FROM Timesheet WHERE id = ${req.params.timesheetId}`, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = timesheetsRouter;