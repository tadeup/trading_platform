module.exports = function (io) {
    const {User} = require('../../models/Users');
    const {Offer} = require('../../models/Offers');
    const {constants} = require('../../config/constants');

    const helpers = require('../../helpers/market');

    async function sellController(req, res, next) {
        let {
            body: {
                asset,
                quantity,
                price
            }
        } = req;

        let currentUser = req.user;
        let errors = helpers.checkFullBody(req, 'sell');

        if (errors || !currentUser){
            helpers.redirectBack('Please provide valid data', false, req, res);
            return;
        }

        if (!helpers.hasMargin(asset, price, quantity, currentUser, constants.margin, "sell")){
            helpers.redirectBack("You don't have enough margin!", false, req, res);
            return;
        }

        let setObject = helpers.setAssetPosition(asset, currentUser, -quantity);

        User.findByIdAndUpdate(req.user, {$inc: setObject})
            .then((user) => {
                if(!user){
                    return res.status(404).send();
                }

                return Offer
                    .find({price: {$gte: price}})
                    .where({isBuy: true})
                    .where({quantity: {$gt: 0}})
                    .sort({price:'descending'})
            }).then(async (docs) => {
            let newOffer = new Offer({
                asset,
                quantity,
                originalQuantity: quantity,
                price,
                'dateCreated':new Date().getTime(),
                ownerId: currentUser._id,
                isBuy: false
            });

            if (docs) {
                let j = 0;
                let pxq;
                let currDate = new Date().getTime();
                while (newOffer.quantity > 0 && j < docs.length) {
                    if (newOffer.quantity > docs[j].quantity){
                        pxq = docs[j].quantity * newOffer.price;
                        const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: -pxq}}).exec();
                        const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: pxq}}).exec();
                        newOffer.quantity -= docs[j].quantity;
                        const p3 = Offer.findByIdAndUpdate(docs[j]._id, {quantity: 0, dateCompleted: currDate}).exec();
                        await Promise.all([p1, p2, p3]);
                        j++;
                    } else {
                        let p3;
                        let newQuantityX = docs[j].quantity - newOffer.quantity;
                        pxq = newOffer.quantity * newOffer.price;
                        const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: {money: -pxq}}).exec();
                        const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: pxq}}).exec();
                        if(newOffer.quantity === docs[j].quantity){
                            p3 = Offer.findByIdAndUpdate(docs[j]._id, {quantity: 0, dateCompleted: currDate}).exec();
                        } else {
                            p3 = Offer.findByIdAndUpdate(docs[j]._id, {quantity: newQuantityX}).exec();
                        }
                        newOffer.quantity = 0;
                        newOffer.dateCompleted = currDate;
                        await Promise.all([p1, p2, p3]);
                    }
                }
            }

            if (newOffer.quantity){
                io.of('/dashboard').emit('newOffer', newOffer);
            }

            return newOffer.save(newOffer)
        }).then((offer) => {
            helpers.redirectBack('Sell offer created', true, req, res);
        }).catch((e) => {
            console.log(e);
            helpers.redirectBack('Ops! Something went wrong! Please contact admin.', false, req, res);
        });

    }

    return sellController;
};
