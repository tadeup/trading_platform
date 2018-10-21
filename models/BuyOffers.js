var mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
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