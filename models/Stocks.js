var mongoose = require('mongoose');

const StocksSchema = mongoose.Schema({
    stockName: {
        type: String
    },
});

const Stock = mongoose.model('Stock', StocksSchema);

module.exports = {Stock};