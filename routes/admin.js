var express = require('express');
var router = express.Router();

const {pricesController} = require('../controllers/admin/prices');
const {studentsController} = require('../controllers/admin/students');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { layout: 'admin' });
});

router.get('/students', studentsController);

router.get('/prices', pricesController);

module.exports = router;
