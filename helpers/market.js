module.exports = {
    checkFullBody: function (req, postType) {
    req.checkBody('asset', 'Asset is required').notEmpty();
    if (postType === "buy"){
        req.checkBody('buyQuantity', 'sellQuantity is required').notEmpty();
        req.checkBody('buyQuantity', 'sellQuantity is required').isInt({min:1, max:99});
        req.checkBody('buyPrice', 'sellPrice is required').notEmpty();
        req.checkBody('buyPrice', 'sellPrice is required').isInt({min:1, max:99});
    } else if (postType === "sell") {
        req.checkBody('sellQuantity', 'sellQuantity is required').notEmpty();
        req.checkBody('sellQuantity', 'sellQuantity is required').isInt({min:1, max:99});
        req.checkBody('sellPrice', 'sellPrice is required').notEmpty();
        req.checkBody('sellPrice', 'sellPrice is required').isInt({min:1, max:99});
    }
    return req.validationErrors();
    },

};
