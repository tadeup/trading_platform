const handlebars = require('express-handlebars');

var exphbs = handlebars.create({
    defaultLayout: 'index',
    // Specify helpers which are only registered on this instance.
    helpers: {
        myOffers: function(context, options) {
            var ret = "";

            for(var i=0, j=context.length; i<j; i++) {
                if (context[i].asset === this.stockName){
                    ret = ret + options.fn(context[i]);
                }
            }

            return ret;
        },

        myClosedOffers: function(context, options) {
            var retQ = 0;
            var retP = 0;

            for(var i=0, j=context.length; i<j; i++) {
                if (context[i].asset === this.stockName){
                    retQ += context[i].originalQuantity - context[i].quantity;
                    retP += context[i].pxqHistory;
                }
            }

            if (retQ > 0) {
                retP = (retP/retQ).toFixed(2);
            }

            return options.fn({retQ, retP});
        },

        myEndedOffers: function(buys, sells, finalValue, options) {
            var qBuy = 0;
            var pBuy = 0;

            var qSell = 0;
            var pSell = 0;

            for(let i=0, j=buys.length; i<j; i++) {
                if (buys[i].asset === this.stockName){
                    qBuy += buys[i].originalQuantity - buys[i].quantity;
                    pBuy += buys[i].pxqHistory;
                }
            }

            if (qBuy > 0) {
                pBuy = (pBuy/qBuy);
            }

            for(let i=0, j=sells.length; i<j; i++) {
                if (sells[i].asset === this.stockName){
                    qSell += sells[i].originalQuantity - sells[i].quantity;
                    pSell += sells[i].pxqHistory;
                }
            }

            if (qSell > 0) {
                pSell = (pSell/qSell);
            }

            let earning = (finalValue - pBuy) * qBuy + (pSell - finalValue) * qSell;
            
            if (earning){
                earning = earning.toFixed(2);
            }

            return options.fn({earning});
        },

        assetOffers: function(context, options) {
            var ret = "";

            for(var i=0, j=context.length; i<j; i++) {
                if (context[i].asset === this.stockName){
                    ret = ret + options.fn(context[i]);
                }
            }

            return ret;
        },
    }
});


module.exports = {exphbs};