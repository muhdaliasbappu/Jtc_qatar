var express = require('express');
var router = express.Router();
var employeHelpers = require('../helpers/employee-helpers')
var projectHelpers = require('../helpers/project-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req)
    res.render('./admin/admin-login');
});
router.get('/employee', function (req, res, next) {
    res.render('./admin/employee', { admin: true });
});
router.get('/projects', function (req, res, next) {
    res.render('./admin/projects', { admin: true });
});
router.get('/add-employee', function (req, res, next) {
    res.render('./admin/add-employee', { admin: true });
});
router.get('/add-project', function (req, res, next) {
    res.render('./admin/add-project', { admin: true });
});
router.post('/add-employee/'), function (req, res) {
    console.log(req.body)
    // employeHelpers.addemployee(req.body, (result) => {
    //res.render('./admin / add - employee', { admin: true });
    //})
}
router.post('/add-project/'), function (req, res) {

    projectHelpers.addproject(req.body, (result) => {
        res.render('./admin/add-project', { admin: true });
    })
}
module.exports = router;
