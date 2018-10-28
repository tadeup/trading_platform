var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.render('index', { title: 'Trading System' });
    } else {
        return res.redirect('/dashboard');
    }
});

module.exports = router;
