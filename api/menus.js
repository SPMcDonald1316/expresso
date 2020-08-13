//Instantiate router
const express = require('express');
const menusRouter = express.Router();

//Import database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Route Parameter
menusRouter.param('menuId', (req, res, next, id) => {
  db.get(`SELECT * FROM Menu WHERE id = ${id}`, (err, menu) => {
    if (err) {
      next(err);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Import menu items router and mount
const menuItemsRouter = require('./menuItems');
menusRouter.use('/:menuId/menu-items', menuItemsRouter);

//Routes
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, menus) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({menus: menus});
    }
  });
});

menusRouter.post('/', (req, res, next) => {
  const menu = req.body.menu;
  if (!menu.title) {
    return res.sendStatus(400);
  }
  db.run('INSERT INTO Menu (title) VALUES ($title)', {
    $title: menu.title
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({menu: menu});
        }
      });
    }
  });
});

menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
});

menusRouter.put('/:menuId', (req, res, next) => {
  const menu = req.body.menu;
  if (!menu.title) {
    return res.sendStatus(400);
  }
  db.run('UPDATE Menu SET title = $title WHERE id = $id', {
    $title: menu.title,
    $id: req.params.menuId
  }, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, (err, menu) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({menu: menu});
        }
      });
    }
  });
});

module.exports = menusRouter;
