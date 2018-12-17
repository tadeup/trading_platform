var mongoose = require('mongoose');

const StocksSchema = mongoose.Schema({
    stockName: {
        type: String
    },
});

StocksSchema.statics.getStockNames = function () {
    
};

const Stock = mongoose.model('Stock', StocksSchema);

module.exports = {Stock};