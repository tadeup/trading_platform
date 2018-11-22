const {User} = require('../../models/Users');
const {SellOffer} = require('../../models/SellOffers');
const {BuyOffer} = require('../../models/BuyOffers');
const {constants} = require('../../config/constants');

const helpers = require('../../helpers/market');

async function sellController(req, res, next) {
    let {
        body: {
            asset,
            sellQuantity,
            sellPrice
        }
    } = req;

    let currentUser = req.user;
    let errors = helpers.checkFullBody(req, 'sell');

    if (errors || !currentUser){
        helpers.redirectBack('Please provide valid data', false, req, res);
        return;
    }

    if (!helpers.hasMargin(asset,sellPrice,sellQuantity, currentUser, constants.margin, "sell")){
        helpers.redirectBack("You don't have enough margin!", false, req, res);
        return;
    }

    let setObject = helpers.setAssetPosition(asset, currentUser, -sellQuantity);

    User.findByIdAndUpdate(req.user, {$inc: setObject})
        .then((user) => {
            if(!user){
                return res.status(404).send();
            }

            return BuyOffer
                .find({buyPrice: {$gte: sellPrice}})
                .where({buyQuantity: {$gt: 0}})
                .sort({buyPrice:'descending'})
        }).then(async (docs) => {
            let newSellOffer = new SellOffer({
                asset,
                sellQuantity,
                sellPrice,
                'dateCreated':new Date().getTime(),
                ownerId: currentUser._id
            });

            if (docs) {
                let j = 0;
                let pxq;
                let currDate = new Date().getTime();
                while (newSellOffer.sellQuantity > 0 && j < docs.length) {
                    if (newSellOffer.sellQuantity > docs[j].buyQuantity){
                        pxq = docs[j].buyQuantity * newSellOffer.sellPrice;
                        let setObject = {};
                        setObject[`assetsOwned.${asset}`] = docs[j].buyQuantity;
                        setObject[`money`] = -pxq;
                        const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                        const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: pxq}}).exec();
                        newSellOffer.sellQuantity -= docs[j].buyQuantity;
                        const p3 = BuyOffer.findByIdAndUpdate(docs[j]._id, {buyQuantity: 0, dateCompleted: currDate}).exec();
                        await Promise.all([p1, p2, p3]);
                        j++;
                    } else {
                        let p3;
                        let newBuyQuant = docs[j].buyQuantity - newSellOffer.sellQuantity;
                        pxq = newSellOffer.sellQuantity * newSellOffer.sellPrice;
                        let setObject = {};
                        setObject[`assetsOwned.${asset}`] = newSellOffer.sellQuantity;
                        setObject[`money`] = -pxq;
                        const p1 = User.findByIdAndUpdate(docs[j].ownerId, {$inc: setObject}).exec();
                        const p2 = User.findByIdAndUpdate(currentUser._id, {$inc: {money: pxq}}).exec();
                        if(newSellOffer.sellQuantity === docs[j].buyQuantity){
                            p3 = BuyOffer.findByIdAndUpdate(docs[j]._id, {buyQuantity: 0, dateCompleted: currDate}).exec();
                        } else {
                            p3 = BuyOffer.findByIdAndUpdate(docs[j]._id, {buyQuantity: newBuyQuant}).exec();
                        }
                        newSellOffer.sellQuantity = 0;
                        newSellOffer.dateCompleted = currDate;
                        await Promise.all([p1, p2, p3]);
                    }
                }
            }
            return newSellOffer.save(newSellOffer)
        }).then((sellOffer) => {
            helpers.redirectBack('Sell offer created', true, req, res);
        }).catch((e) => {
            console.log(e);
            helpers.redirectBack('Ops! Something went wrong! Please contact admin.', false, req, res);
        });

}

module.exports = {sellController};
