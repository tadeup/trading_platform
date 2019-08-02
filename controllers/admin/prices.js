const moment = require('moment');

const {Offer} = require('../../models/Offers');
const {Stock} = require('../../models/Stocks');

async function pricesController(req, res, next) {
    const {asset} = req.query;
    const stocks = await Stock.find().exec();
    let allTimes;
    let timesAndPrices;
    if (asset) {
        allTimes = await Offer
          .find()
          .where({asset})
          .where({quantity: 0})
          .sort({dateCompleted: 'asc'})
          .exec();

        timesAndPrices = allTimes.map(a => {
            return a.dateCompleted
                ? {
                    time : moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss'),
                    price : a.pxqHistory / a.originalQuantity
                }
                : {
                    time : "UNCOMPLETE",
                    price : a.price
                }
        });
    }



    let contextObj = {
        stocks,
        layout: 'admin',
        timesAndPrices,
        active: {
            'prices': true,
        }};

    res.render('admin/prices', contextObj);
}

module.exports = {pricesController};