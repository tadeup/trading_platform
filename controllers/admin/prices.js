const moment = require('moment');

const {BuyOffer} = require('../../models/BuyOffers');

async function pricesController(req, res, next) {
    const {
        body: {
            asset,
            timeInSeconds
        }
    } = req;

    let allTimes = await BuyOffer.find({dateCompleted: {$exists: true}}).sort({dateCompleted: 'asc'}).exec();
    let timesAndPrices = allTimes.map(a => {
        return {
            time : moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss'),
            price : a.buyPrice}
    });
    
    let contextObj = {
        layout: 'admin',
        timesAndPrices,
        active: {
            'prices': true,
        }};

    res.render('admin/prices', contextObj);
}

module.exports = {pricesController};