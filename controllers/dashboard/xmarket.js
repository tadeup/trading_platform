const {Offer} = require('../../models/Offers');
const {Stock} = require('../../models/Stocks');

async function xmarketController(req, res, next) {

    let sellOffers = Offer.find()
        .where({isBuy: false})
        .where({quantity: {$gt: 0}})
        .where({wasDeleted: false})
        .sort({price:1})
        .exec();
    let buyOffers = Offer.find()
        .where({isBuy: true})
        .where({quantity: {$gt: 0}})
        .where({wasDeleted: false})
        .sort({price:-1})
        .exec();
    let closedSellOffers = Offer.find()
        .where({isBuy: false})
        .where({wasModified: true})
        .where({ownerId: {$eq: req.user._id}})
        .exec();
    let closedBuyOffers = Offer.find()
        .where({isBuy: true})
        .where({wasModified: true})
        .where({ownerId: {$eq: req.user._id}})
        .exec();
    let stockNames = Stock.find().exec();

    [sellOffers, buyOffers,closedSellOffers,closedBuyOffers, stockNames] = await Promise.all([sellOffers, buyOffers,closedSellOffers,closedBuyOffers, stockNames]);

    // stockNames = stockNames.map(stock => stock.stockName);
    const UserOffersBuy = buyOffers
        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
    const UserOffersSell = sellOffers
        .filter(offer => `${offer.ownerId}` === `${req.user._id}`);


    var contextObj = {
        layout: 'dashboard',
        stockNames,
        sellOffers,
        closedSellOffers,
        closedBuyOffers,
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