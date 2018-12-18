var express = require('express');
var router = express.Router();

const {Offer} = require('../models/Offers');
const {Stock} = require('../models/Stocks');

const {xmarketController} = require('../controllers/dashboard/xmarket');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('dashboard/profile')
});

router.get('/profile', function(req, res, next) {
    res.render('dashboard/profile', {
        layout: 'dashboard',
        active: {
            'profile': true
        }});
});

router.get('/xmarket', xmarketController);

router.get('/info', function(req, res, next) {
    res.render('dashboard/info', {
        layout: 'dashboard',
        active: {
            'info': true
        }});
});


module.exports = router;
