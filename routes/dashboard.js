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

router.get('/market', async function(req, res, next) {
    let stockNames = await Stock.findOne().exec();
    res.redirect(`market/${stockNames.stockName}`)
});

router.get('/market/:assetName', async function(req, res, next) {
    const {assetName} = req.params;
    let stockNames = await Stock.find().exec();
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
                        stockNames,
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
