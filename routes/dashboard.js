var express = require('express');
var router = express.Router();

const {Offer} = require('../models/Offers');

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

router.get('/market', function(req, res, next) {
    res.redirect('market/stockA')
});

router.get('/market/:assetName', function(req, res, next) {
    const {assetName} = req.params;
    Offer.find({asset: assetName})
        .where({isBuy: false})
        .where({quantity: {$gt: 0}})
        .sort({price:1})
        .exec(function (err, sellOffers) {
        if(err){
            console.log(err);
        } else {
            Offer.find({asset: assetName})
                .where({isBuy: true})
                .where({quantity: {$gt: 0}})
                .sort({price:-1})
                .exec(function (err, buyOffers) {
                if(err){
                    console.log(err);
                } else {
                    const UserOffersBuy = buyOffers
                        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
                    const UserOffersSell = sellOffers
                        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);

                    var contextObj = {
                        layout: 'dashboard',
                        sellOffers,
                        buyOffers,
                        UserOffersBuy,
                        UserOffersSell,
                        assetName,
                        currentUser: req.user,
                        positionOnAsset: req.user.assetPositions[`${assetName}`],
                        active: {
                            'market': true,
                        }};
                    contextObj.active[`${assetName}`] = true;
                    res.render('dashboard/market', contextObj);
                }
            });
        }
    });
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
