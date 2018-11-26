const moment = require('moment');

const {User} = require('../../models/Users');
const {BuyOffer} = require('../../models/BuyOffers');
const {SellOffer} = require('../../models/SellOffers');

async function studentsController(req, res, next) {
    const students = await User.find({isAdmin: false}).exec();
    let offers;

    if(req.query.student){
        const {student} = req.query;
        const studentBuyOffers = await BuyOffer.find({ownerId: student}).exec();
        const studentSellOffers = await SellOffer.find({ownerId: student}).exec();

        offers = studentBuyOffers
            .map(a => {
                return {
                    asset: a.asset,
                    q: a.buyQuantity,
                    p: a.buyPrice,
                    dateCreated : moment(a.dateCreated).format('YYYY-DD-MM HH:mm:ss'),
                    dateCompleted : moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss'),}
                })
            .concat(studentSellOffers
                .map(a => {
                    return {
                        asset: a.asset,
                        q: a.sellQuantity,
                        p: a.sellPrice,
                        dateCreated : moment(a.dateCreated).format('YYYY-DD-MM HH:mm:ss'),
                        dateCompleted : a.dateCompleted
                            ? moment(a.dateCompleted).format('YYYY-DD-MM HH:mm:ss')
                            : "UNCOMPLETED"
                    }
                })
            )
    }

    let contextObj = {
        layout: 'admin',
        students,
        offers,
        active: {
            'students': true,
        }};
    res.render('admin/students', contextObj);
}

module.exports = {studentsController};