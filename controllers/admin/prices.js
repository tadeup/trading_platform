const moment = require('moment');

const {Offer} = require('../../models/Offers');

async function pricesController(req, res, next) {
    const {
        body: {
            asset,
            timeInSeconds
        }
    } = req;

    let allTimes = await Offer.find({dateCompleted: {$exists: true}}).sort({dateCompleted: 'asc'}).exec();
    let timesAndPrices = allTimes.map(a => {
        return {
            time : moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss'),
            price : a.price
        }
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