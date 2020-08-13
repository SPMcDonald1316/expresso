//Instantiate Router
const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});

//Import database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Route Parameter
menuItemsRouter.param('menuItemId', (req, res, next, id) => {
  db.get(`SELECT * FROM MenuItem WHERE id = ${id}`, (err, menuItem) => {
    if (err) {
      next(err);
    } else if (menuItem) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Routes
menuItemsRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (err, menuItems) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({menuItems: menuItems});
    }
  });
});

menuItemsRouter.post('/', (req, res, next) => {
  const menuItem = req.body.menuItem;
  if (!menuItem.name || !menuItem.inventory || !menuItem.price) {
    return res.sendStatus(400);
  }
  db.run('INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)', {
    $name: menuItem.name,
    $description: menuItem.description,
    $inventory: menuItem.inventory,
    $price: menuItem.price,
    $menuId: req.params.menuId
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (err, menuItem) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({menuItem: menuItem});
        }
      });
    }
  });
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const menuItem = req.body.menuItem;
  if (!menuItem.name || !menuItem.inventory || !menuItem.price) {
    return res.sendStatus(400);
  }
  db.run('UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $id', {
    $name: menuItem.name,
    $description: menuItem.description,
    $inventory: menuItem.inventory,
    $price: menuItem.price,
    $id: req.params.menuItemId
  }, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`, (err, menuItem) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({menuItem: menuItem});
        }
      });
    }
  });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  db.run(`DELETE FROM MenuItem WHERE id = ${req.params.menuItemId}`, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = menuItemsRouter;