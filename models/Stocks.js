var mongoose = require('mongoose');

const StocksSchema = mongoose.Schema({
    stockName: {
        type: String
    },
    continuo: {
        type: Boolean
    },
    margin: {
        type: Number
    },
    finalValue: {
        type: Number
    }
});

StocksSchema.statics.getStockNames = function () {
    
};

const Stock = mongoose.model('Stock', StocksSchema);

module.exports = {Stock};