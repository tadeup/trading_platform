module.exports = {
    checkFullBody: function (req, postType) {
        req.checkBody('asset', 'Asset is required').notEmpty();
        if (postType === "buy"){
            req.checkBody('buyQuantity', 'sellQuantity is required').notEmpty();
            req.checkBody('buyQuantity', 'sellQuantity is required').isInt({min:1, max:99});
            req.checkBody('buyPrice', 'sellPrice is required').notEmpty();
            req.checkBody('buyPrice', 'sellPrice is required').isDecimal({decimal_digits: '2', min:1, max:99});
        } else if (postType === "sell") {
            req.checkBody('sellQuantity', 'sellQuantity is required').notEmpty();
            req.checkBody('sellQuantity', 'sellQuantity is required').isInt({min:1, max:99});
            req.checkBody('sellPrice', 'sellPrice is required').notEmpty();
            req.checkBody('sellPrice', 'sellPrice is required').isDecimal({decimal_digits: '2',min:1, max:99});
        }
        return req.validationErrors();
    },
    redirectBack: function (message, success, req, res) {
        req.flash(success ? 'success_msg' : 'error_msg', message);
        res.redirect('back');
    },
    setAssetPosition: function (asset, currentUser, q) {
        let setObject = {};
        setObject[`assetPositions.${asset}`] = q;
        return setObject;
    },
    hasMargin: function (asset ,p, q, currentUser, margin, type) {
        let sum = 0;
        let e = currentUser.assetPositions.toJSON();
        for( let el in e ) {
            if( currentUser.assetPositions.hasOwnProperty( el ) ) {
                sum += parseFloat( currentUser.assetPositions [el] );
            }
        }
        console.log(sum, margin, currentUser.money);
        if (type === "buy"){
            return (q < -currentUser.assetPositions[asset]) ?
                true :
                p * q < margin + currentUser.money - sum

        } else if (type === "sell") {
            return (q < currentUser.assetPositions[asset]) ?
                true :
                p * q < margin + currentUser.money + sum
        } else {
            throw "type argument must equal 'buy' or 'sell'"
        }
    }

};
