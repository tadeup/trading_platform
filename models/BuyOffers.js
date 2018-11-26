var mongoose = require('mongoose');

const BuyOfferSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    asset: {
        type: String
    },
    buyPrice: {
        type: Number
    },
    buyQuantity: {
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

BuyOfferSchema.statics.createBuyOffer = function(callback){

};

var BuyOffer = mongoose.model('BuyOffer', BuyOfferSchema);

module.exports = {BuyOffer};