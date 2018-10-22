var mongoose = require('mongoose');

const BuyOfferSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    asset: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    dateCreated: {
        type: Date
    }
});

var BuyOffer = mongoose.model('BuyOffer', BuyOfferSchema);

module.exports = {BuyOffer};