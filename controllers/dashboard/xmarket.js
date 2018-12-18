const {Offer} = require('../../models/Offers');
const {Stock} = require('../../models/Stocks');

async function xmarketController(req, res, next) {
    let sellOffers = Offer.find()
        .where({isBuy: false})
        .where({quantity: {$gt: 0}})
        .sort({price:1})
        .exec();
    let buyOffers = Offer.find()
        .where({isBuy: true})
        .where({quantity: {$gt: 0}})
        .sort({price:-1})
        .exec();
    let stockNames = Stock.find().exec();

    [sellOffers, buyOffers, stockNames] = await Promise.all([sellOffers, buyOffers, stockNames]);

    // stockNames = stockNames.map(stock => stock.stockName);
    const UserOffersBuy = buyOffers
        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
    const UserOffersSell = sellOffers
        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);



    var contextObj = {
        layout: 'dashboard',
        stockNames,
        sellOffers,
        buyOffers,
        UserOffersBuy,
        UserOffersSell,
        currentUser: req.user,
        active: {
            'market': true,
        }};
    res.render('dashboard/xmarket', contextObj);
}

module.exports = {xmarketController};