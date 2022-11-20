var express = require('express');
var router = express.Router();

const { getMenu, getDish, addDish, editDish} = require("../controllers/menu.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('admin/menu');
});

router.get('/:role/add', (req, res) => {
  res.render('add');
});
router.post('/:role/add', addDish);

router.get('/:role/menu', getMenu);

router.post('/:role/dish/:id', editDish);
router.get('/:role/dish/:id', getDish);

module.exports = router;