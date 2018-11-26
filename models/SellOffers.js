var mongoose = require('mongoose');

const SellOfferSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    asset: {
        type: String
    },
    sellPrice: {
        type: Number
    },
    sellQuantity: {
        type: Number
    },
    originalQuantity: {
        type: Number
    },
    dateCreated: {
        type: Date
    },
    wasDeleted: {
        type: Boolean
    },
    dateCompleted: {
        type: Date
    }
});

SellOfferSchema.statics.createSellOffer = function (newOffer, callback) {

};

var SellOffer = mongoose.model('SellOffer', SellOfferSchema);

module.exports = {SellOffer};