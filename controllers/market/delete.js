const {User} = require('../../models/Users');
const {Offer} = require('../../models/Offers');
const {constants} = require('../../config/constants');

const helpers = require('../../helpers/market');

function deleteOfferController (req, res, next) {
    const {offerId, offerType} = req.params;
    let sign;

    if (offerType === 'sell'){
        sign = 1;
    } else if (offerType === 'buy'){
        sign = -1;
    } else {
        return res.status(404).send()
    }

    Offer.findById(offerId)
        .then((offer) => {
            if (req.user && `${offer.ownerId}` === `${req.user._id}`) {
                return Offer.findByIdAndUpdate(offerId, {quantity: 0, wasDeleted: true})
            } else {
                throw 403;
            }
        })
        .then((deletedObj) => {
            let setObject = {};
            setObject[`assetPositions.${deletedObj.asset}`] = sign * deletedObj.quantity;
            return User.findByIdAndUpdate(req.user, {$inc: setObject});
        })
        .then((ob) => {
            return res.status(200).send('Successfully deleted');
        }).catch((e) => {
            return res.status(e).send();
        });

}

module.exports = {deleteOfferController};
