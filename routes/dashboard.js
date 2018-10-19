var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', {
        layout: 'layout-dashboard',
        active: {
            'dashboard': true
        }});
});

router.get('/profile', function(req, res, next) {
    res.render('profile', {
        layout: 'layout-dashboard',
        active: {
            'profile': true
        }});
});

router.get('/buy', function(req, res, next) {
    res.render('buy', {
        layout: 'layout-dashboard',
        active: {
            'buy': true
        }});
});

router.get('/sell', function(req, res, next) {
    res.render('sell', {
        layout: 'layout-dashboard',
        active: {
            'sell': true
        }});
});

router.get('/info', function(req, res, next) {
    res.render('info', {
        layout: 'layout-dashboard',
        active: {
            'info': true
        }});
});


module.exports = router;
