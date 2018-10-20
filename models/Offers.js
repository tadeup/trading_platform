var mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});