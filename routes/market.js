var express = require('express');
var router = express.Router();

const {User} = require('../models/Users');
const {SellOffer} = require('../models/SellOffers');
const {BuyOffer} = require('../models/BuyOffers');

/* GET home page. */
router.post('/buy', function(req, res, next) {
    var {body: {
        asset,
        buyQuantity,
        buyPrice
    }} = req;

    req.checkBody('asset', 'Asset is required').notEmpty();
    req.checkBody('buyQuantity', 'sellQuantity is required').notEmpty();
    req.checkBody('buyQuantity', 'sellQuantity is required').isInt({min:1, max:99});
    req.checkBody('buyPrice', 'sellPrice is required').notEmpty();
    req.checkBody('buyPrice', 'sellPrice is required').isInt({min:1, max:99});

    var errors = req.validationErrors();
    if (errors){
        req.flash('error_msg', 'Please provide valid data');
        res.redirect('back');
    } else {
        var newBuyOffer = new BuyOffer({
            asset, buyQuantity, buyPrice, 'dateCreated':new Date().getTime()
        });

        newBuyOffer.save(newBuyOffer, function (err, buyOffer) {
            if(err) console.log(err);
            console.log(buyOffer);
        });

        req.flash('success_msg', 'Buy offer created');

        res.redirect('back');
    }
});

router.post('/sell', function(req, res, next) {
    var {body: {
        asset,
        sellQuantity,
        sellPrice
    }} = req;

    req.checkBody('asset', 'Asset is required').notEmpty();
    req.checkBody('sellQuantity', 'sellQuantity is required').notEmpty();
    req.checkBody('sellQuantity', 'sellQuantity is required').isInt({min:1, max:99});
    req.checkBody('sellPrice', 'sellPrice is required').notEmpty();
    req.checkBody('sellPrice', 'sellPrice is required').isInt({min:1, max:99});

    var errors = req.validationErrors();
    if (errors){
        req.flash('error_msg', 'Please provide valid data');
        res.redirect('back');
    } else {

        currentUser = req.user;
        if (sellQuantity > currentUser.assetsOwned[asset]){
            req.flash('error_msg', 'You dont have enough assets!');
            return res.redirect('back');
        }

        var setObject = {};
        setObject[`assetsOwned.${asset}`] = currentUser.assetsOwned[asset] - sellQuantity;

        User.findByIdAndUpdate(req.user, {$set: setObject}).then((User) => {
            if(!User){
                return res.status(404).send();
            }

            var newSellOffer = new SellOffer({
                asset, sellQuantity, sellPrice, 'dateCreated':new Date().getTime()
            });
            
            BuyOffer.find({buyPrice: {$lte: sellPrice}}, function (err, docs) {
                if (err) {
                    req.flash('error_msg', err);
                    return res.redirect('back');
                }

                if (docs){
                    // CONTINUE FROM HERE
                }
            });
            
            newSellOffer.save(newSellOffer, function (err, sellOffer) {
                if(err) console.log(err);
                console.log(sellOffer);
            });

            req.flash('success_msg', 'Sell offer created');

            res.redirect('back');

        }).catch((e) => {
            res.status(400).send();
        });
    }
});

router.get('/profile', function(req, res, next) {

    //here it is
    var user = req.user;

    //you probably also want to pass this to your view
    res.send(user);
});

module.exports = router;
