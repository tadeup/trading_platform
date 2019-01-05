var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/users/login');
    } else {
        return res.redirect('/dashboard');
    }
});

module.exports = router;
