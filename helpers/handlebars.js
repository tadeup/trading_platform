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