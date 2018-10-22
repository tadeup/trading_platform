var express = require('express');
var router = express.Router();

const {User} = require('../models/Users');
const {SellOffer} = require('../models/SellOffers');
const {BuyOffer} = require('../models/BuyOffers');

/* GET home page. */
router.post('/buy', function(req, res, next) {
    res.status(200).send(req.body);
});

router.post('/sell', function(req, res, next) {
    var {body: {
        asset,
        sellQuantity,
        sellPrice
    }} = req;

    req.checkBody('asset', 'Asset is required').notEmpty();
    req.checkBody('sellQuantity', 'sellQuantity is required').notEmpty();
    req.checkBody('sellQuantity', 'sellQuantity is required').isInt({min:0, max:99});
    req.checkBody('sellPrice', 'sellPrice is required').notEmpty();
    req.checkBody('sellPrice', 'sellPrice is required').isInt({min:0, max:99});

    var errors = req.validationErrors();
    if (errors){
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        req.flash('error_msg', 'Please provide valid data');
        res.redirect('back');
    } else {
        var newSellOffer = new SellOffer({
            asset, 'quantity':sellQuantity, 'price':sellPrice, 'dateCreated':new Date().getTime()
        });

        newSellOffer.save(newSellOffer, function (err, sellOffer) {
            if(err) console.log(err);
            console.log(sellOffer);
        });

        req.flash('success_msg', 'Sell offer created');

        res.redirect('back');
    }
});

module.exports = router;
