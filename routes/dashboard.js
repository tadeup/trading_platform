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

router.get('/market', function(req, res, next) {
    res.render('market', {
        layout: 'layout-dashboard',
        active: {
            'market': true
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
