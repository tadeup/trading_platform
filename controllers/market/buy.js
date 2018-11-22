const {User} = require('../../models/Users');
const {SellOffer} = require('../../models/SellOffers');
const {BuyOffer} = require('../../models/BuyOffers');
const {constants} = require('../../config/constants');

const helpers = require('../../helpers/market');

function buyController(req, res, next) {
    var {
        body: {
            asset,
            buyQuantity,
            buyPrice
        }
    } = req;

    let currentUser = req.user;
    let errors = helpers.checkFullBody(req, 'buy');

    if (errors || !currentUser){
        helpers.redirectBack('Please provide valid data', false, req, res);
        return;
    }

    if (!helpers.hasMargin(asset, buyPrice, buyQuantity, currentUser, constants.margin, "buy")){
        helpers.redirectBack("You don't have enough margin!", false, req, res);
        return;
    }

    let setObject = helpers.setAssetPosition(asset, currentUser, buyQuantity);

    User.findByIdAndUpdate(req.user, {$inc: setObject})
        .then((user) => {
            if(!user){
                return res.status(404).send();
            }

            return SellOffer
                .find({sellPrice: {$lte: buyPrice}})
                .where({sellQuantity: {$gt: 0}})
                .sort({sellPrice:'ascending'})
        }).then(async (docs) => {
        let newBuyOffer = new BuyOffer({
            asset,
            buyQuantity,
            buyPrice,
            'dateCreated': new Date().getTime(),
            ownerId: currentUser._id
        });

        if (docs) {
            let j = 0;
            let pxq;
            let currDate = new Date().getTime();
            while (newBuyOffer.buyQuantity > 0 && j < docs.length) {
                if (newBuyOffer.buyQuantity > docs[j].sellQuantity){
                    pxq = docs[j].sellQuantity * newBuyOffer.buyPrice;
                    let setObject = {};
                    setObject[`assetsOwned.${asset}`] = docs[j].sellQuantity;
                    setObject[`money`] = pxq;
                    const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                    const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: -pxq}}).exec();
                    newBuyOffer.buyQuantity -= docs[j].sellQuantity;
                    const p3 = SellOffer.findByIdAndUpdate(docs[j]._id, {sellQuantity: 0, dateCompleted: currDate}).exec();
                    await Promise.all([p1, p2, p3]);
                    j++;
                } else {
                    let p3;
                    let newSellQuant = docs[j].sellQuantity - newBuyOffer.buyQuantity;
                    pxq = newBuyOffer.buyQuantity * newBuyOffer.buyPrice;
                    let setObject = {};
                    setObject[`assetsOwned.${asset}`] = newBuyOffer.buyQuantity;
                    setObject[`money`] = pxq;
                    const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                    const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: -pxq}}).exec();
                    if(newBuyOffer.buyQuantity === docs[j].sellQuantity){
                        p3 = SellOffer.findByIdAndUpdate(docs[j]._id, {sellQuantity: 0, dateCompleted: currDate}).exec();
                    } else {
                        p3 = SellOffer.findByIdAndUpdate(docs[j]._id, {sellQuantity: newSellQuant}).exec();
                    }
                    newBuyOffer.buyQuantity = 0;
                    newBuyOffer.dateCompleted = currDate;
                    await Promise.all([p1, p2, p3]);
                }
            }
        }
        return newBuyOffer.save(newBuyOffer)
    }).then((buyOffer) => {
        helpers.redirectBack('Buy offer created', true, req, res);
    }).catch((e) => {
        console.log(e);
        helpers.redirectBack('Ops! Something went wrong! Please contact admin.', false, req, res);
    });
}

module.exports = {buyController};
