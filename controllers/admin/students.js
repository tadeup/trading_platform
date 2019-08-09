const moment = require('moment');

const {User} = require('../../models/Users');
const {Offer} = require('../../models/Offers');
const {Stock} = require('../../models/Stocks');

async function studentsController(req, res, next) {
    let students = User.find({}).exec();
    let stockNames = Stock.find().exec();
    let closedSellOffers = Offer.find()
      .where({isBuy: false})
      .where({wasModified: true})
      .where({ownerId: {$eq: req.query.student}})
      .exec();
    let closedBuyOffers = Offer.find()
      .where({isBuy: true})
      .where({wasModified: true})
      .where({ownerId: {$eq: req.query.student}})
      .exec();

    [students, stockNames,closedSellOffers,closedBuyOffers] = await Promise.all([students, stockNames,closedSellOffers,closedBuyOffers]);

    if(req.query.student){
        const {student} = req.query;
        const studentOffers = await Offer.findByOwnerID(student).exec();

        var offers = studentOffers
            .map(a => {
                return {
                    asset: a.asset,
                    q: a.originalQuantity,
                    p: a.price,
                    offerType: a.isBuy ? 'buy' : 'sell',
                    dateCreated : moment(a.dateCreated).format('YYYY-DD-MM HH:mm:ss'),
                    dateCompleted : a.dateCompleted
                        ? moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss')
                        : "UNCOMPLETED"
                }
            })
    }
console.log(stockNames);
    let contextObj = {
        layout: 'admin',
        students,
        offers,
        stockNames,
        closedSellOffers,
        closedBuyOffers,
        active: {
            'students': true,
        }};
    res.render('admin/students', contextObj);
}

module.exports = {studentsController};