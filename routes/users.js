var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('./users/user-login');
});
router.get('/employeelist', function (req, res) {
  res.render('./users/employee-list');
});

module.exports = router;
