var express = require('express');
var router = express.Router();

const { getMenu, getDish, addDish, editDish} = require("../controllers/menu.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('menu');
});

router.get('/add', (req, res) => {
  res.render('add');
});
router.post('/add', addDish);

router.get('/menu', getMenu);

router.post('/dish/:id', editDish);
router.get('/dish/:id', getDish);

module.exports = router;