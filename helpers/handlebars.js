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
            var retQ = 0;

            for(let i=0, j=buys.length; i<j; i++) {
                if (buys[i].asset === this.stockName){
                    retQ += buys[i].originalQuantity - buys[i].quantity;
                }
            }
            for(let i=0, j=sells.length; i<j; i++) {
                if (sells[i].asset === this.stockName){
                    retQ -= sells[i].originalQuantity - sells[i].quantity;
                }
            }

            let earning = retQ * finalValue;

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