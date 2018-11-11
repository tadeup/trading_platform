var express = require('express');
var router = express.Router();

const {SellOffer} = require('../models/SellOffers');
const {BuyOffer} = require('../models/BuyOffers');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('dashboard', {
    //     layout: 'layout-dashboard',
    //     active: {
    //         'dashboard': true
    //     }});
    res.redirect('dashboard/profile')
});

router.get('/profile', function(req, res, next) {
    res.render('profile', {
        layout: 'layout-dashboard',
        active: {
            'profile': true
        }});
});

router.get('/market', function(req, res, next) {
    res.redirect('market/stockA')
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
                    const UserOffersBuy = buyOffers
                        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
                    const UserOffersSell = sellOffers
                        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
                    var contextObj = {
                        layout: 'layout-dashboard',
                        sellOffers,
                        buyOffers,
                        UserOffersBuy,
                        UserOffersSell,
                        assetName,
                        currentUser: req.user,
                        active: {
                            'market': true,
                        }};
                    contextObj.active[`${assetName}`] = true;
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
