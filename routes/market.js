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
        var currentUser = req.user;
        if (buyQuantity * buyPrice > currentUser.money){
            req.flash('error_msg', "You don't have enough money!");
            return res.redirect('back');
        }

        var newBuyOffer = new BuyOffer({
            asset, buyQuantity, buyPrice, 'dateCreated':new Date().getTime(), ownerId: currentUser._id
        });

        SellOffer
            .find({sellPrice: {$lte: buyPrice}})
            .sort({sellPrice:'ascending'})
            .exec(function (err, docs) {
                if (err) {
                    req.flash('error_msg', err);
                    return res.redirect('back');
                }

                if (docs){
                    var j = 0;
                    var pxq;
                    while (newBuyOffer.buyQuantity > 0 && j < docs.length) {
                        if (newBuyOffer.buyQuantity > docs[j].sellQuantity){
                            pxq = docs[j].sellQuantity * docs[j].sellPrice;
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: pxq}}).exec();
                            User.findByIdAndUpdate(currentUser._id, {$inc: {money: -pxq}}).exec();
                            newBuyOffer.buyQuantity -= docs[j].sellQuantity;
                            SellOffer.findByIdAndUpdate(docs[j]._id, {sellQuantity: 0}).exec();
                            j++;
                        } else {
                            var newSellQuant = docs[j].sellQuantity - newBuyOffer.buyQuantity;
                            pxq = newSellQuant * docs[j].sellPrice;
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: pxq}}).exec();
                            User.findByIdAndUpdate(currentUser._id, {$inc: {money: -pxq}}).exec();
                            SellOffer.findByIdAndUpdate(docs[j]._id, {sellQuantity: newSellQuant}).exec();
                            newBuyOffer.buyQuantity = 0;
                        }
                    }
                }

                var setObject = {};
                var totalBought = buyQuantity - newBuyOffer.buyQuantity;
                setObject[`assetsOwned.${asset}`] = currentUser.assetsOwned[asset] + totalBought;
                User.findByIdAndUpdate(req.user, {$set: setObject}).exec();

                newBuyOffer.save(newBuyOffer, function (err, buyOffer) {
                    if(err) console.log(err);
                    console.log(buyOffer);
                });

                req.flash('success_msg', 'Buy offer created');
                res.redirect('back');

            });
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

        var currentUser = req.user;
        if (sellQuantity > currentUser.assetsOwned[asset]){
            req.flash('error_msg', "You don't have enough assets!");
            return res.redirect('back');
        }

        var setObject = {};
        setObject[`assetsOwned.${asset}`] = currentUser.assetsOwned[asset] - sellQuantity;

        User.findByIdAndUpdate(req.user, {$set: setObject}).then((user) => {
            if(!user){
                return res.status(404).send();
            }

            var newSellOffer = new SellOffer({
                asset, sellQuantity, sellPrice, 'dateCreated':new Date().getTime(), ownerId: currentUser._id
            });

            BuyOffer
                .find({buyPrice: {$gte: sellPrice}})
                .sort({buyPrice:'descending'})
                .exec(function (err, docs) {
                if (err) {
                    req.flash('error_msg', err);
                    return res.redirect('back');
                }

                if (docs){
                    var j = 0;
                    var pxq;
                    while (newSellOffer.sellQuantity > 0 && j < docs.length) {
                        if (newSellOffer.sellQuantity > docs[j].buyQuantity){
                            pxq = docs[j].buyQuantity * newSellOffer.sellPrice;
                            let setObject = {};
                            setObject[`assetsOwned.${asset}`] = docs[j].buyQuantity;
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: -pxq}}).exec();
                            User.findByIdAndUpdate(currentUser._id, {$inc: {money: pxq}}).exec();
                            newSellOffer.sellQuantity -= docs[j].buyQuantity;
                            BuyOffer.findByIdAndUpdate(docs[j]._id, {buyQuantity: 0}).exec();
                            j++;
                        } else {
                            var newBuyQuant = docs[j].buyQuantity - newSellOffer.sellQuantity;
                            pxq = newSellOffer.sellQuantity * newSellOffer.sellPrice;
                            let setObject = {};
                            setObject[`assetsOwned.${asset}`] = newSellOffer.sellQuantity;
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                            User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: pxq}}).exec();
                            User.findByIdAndUpdate(currentUser._id, {$inc: {money: -pxq}}).exec();
                            BuyOffer.findByIdAndUpdate(docs[j]._id, {buyQuantity: newBuyQuant}).exec();
                            newSellOffer.sellQuantity = 0;
                        }
                    }
                }

                newSellOffer.save(newSellOffer, function (err, sellOffer) {
                    if(err) console.log(err);
                    console.log(sellOffer);
                });

                req.flash('success_msg', 'Sell offer created');
                res.redirect('back');

            });

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
