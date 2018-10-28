var express = require('express');
var router = express.Router();

const {SellOffer} = require('../models/SellOffers');
const {BuyOffer} = require('../models/BuyOffers');

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

router.get('/market/:assetName', function(req, res, next) {
    const {assetName} = req.params;
    SellOffer.find({asset: assetName, sellQuantity: {$gt:0}}, function (err, sellOffers) {
        if(err){
            console.log(err);
        } else {
            BuyOffer.find({asset: assetName, buyQuantity: {$gt:0}}, function (err, buyOffers) {
                if(err){
                    console.log(err);
                } else {
                    var contextObj = {
                        layout: 'layout-dashboard',
                        sellOffers,
                        buyOffers,
                        assetName,
                        active: {
                            'market': true,
                        }};
                    contextObj.active[`${assetName}`] = true;
                    console.log(contextObj);
                    res.render('market', contextObj);
                }
            });
        }
    });
});

router.get('/info', function(req, res, next) {
    res.render('info', {
        layout: 'layout-dashboard',
        active: {
            'info': true
        }});
});


module.exports = router;
