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
    dateCreated: {
        type: Date
    },
    dateCompleted: {
        type: Date
    }
});

SellOfferSchema.statics.createSellOffer = function (newOffer, callback) {

};

var SellOffer = mongoose.model('SellOffer', SellOfferSchema);

module.exports = {SellOffer};