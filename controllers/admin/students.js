const moment = require('moment');

const {User} = require('../../models/Users');
const {Offer} = require('../../models/Offers');

async function studentsController(req, res, next) {
    const students = await User.find({isAdmin: false}).exec();

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