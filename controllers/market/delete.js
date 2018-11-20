const {User} = require('../../models/Users');
const {SellOffer} = require('../../models/SellOffers');
const {BuyOffer} = require('../../models/BuyOffers');
const {constants} = require('../../config/constants');

const helpers = require('../../helpers/market');

function deleteOfferController (req, res, next) {
    const {offerId, offerType} = req.params;

    if (offerType === 'sell'){
        SellOffer.findById(offerId)
            .then((offer) => {
                if (req.user && `${offer.ownerId}` === `${req.user._id}`) {
                    return SellOffer.findByIdAndDelete(offerId)
                } else {
                    throw 403;
                }
            }).then((deletedObj) => {
            var setObject = {};
            setObject[`assetPositions.${deletedObj.asset}`] = req.user.assetPositions[deletedObj.asset] + deletedObj.sellQuantity;
            return User.findByIdAndUpdate(req.user, {$set: setObject});
        }).then((ob) => {
            return res.status(200).send('Successfully deleted');
        }).catch((e) => {
            return res.status(e).send();
        });
        res.send('sell');
    } else if (offerType === 'buy'){
        BuyOffer.findById(offerId)
            .then((offer) => {
                if (req.user && `${offer.ownerId}` === `${req.user._id}`) {
                    return BuyOffer.findByIdAndDelete(offerId)
                } else {
                    throw 403;
                }
            })
            .then((deletedObj) => {
                return res.status(200).send('Successfully deleted');
            }).catch((e) => {
            return res.status(e).send();
        });
    } else {
        res.status(404).send()
    }
}

module.exports = {deleteOfferController};
