var express = require('express');
var router = express.Router();

const { getMenu, getDish, addDish, editDish, login} = require("../controllers/controller.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/login")
});

router.get('/:role/add', (req, res) => {
  res.render('add');
});
router.post('/:role/add', addDish);

router.get('/:role/menu', getMenu);

router.post('/:role/dish/:id', editDish);
router.get('/:role/dish/:id', getDish);

router.get("/login", (req, res) => {
  res.render('login')
})
router.post('/login', login)

module.exports = router;