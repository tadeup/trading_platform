var mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
    ownerId: {
        type: String,
    },
    asset: {
        type: String
    },
    price: {
        type: String
    },
    quantity: {
        type: String
    }
});