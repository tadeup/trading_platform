var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', { layout: 'layout-dashboard' });
});

router.get('/test', function(req, res, next) {
    res.render('dash-test', { layout: 'layout-dashboard' });
});


module.exports = router;
