module.exports = {
    checkFullBody: function (req) {
        req.checkBody('asset', 'Asset is required').notEmpty();

        req.checkBody('quantity', 'quantity is required').notEmpty();
        req.checkBody('quantity', 'quantity is required').isInt({min:1, max:999});
        req.checkBody('price', 'price is required').notEmpty();
        req.checkBody('price', 'price is required').isDecimal({decimal_digits: '1,2', min:1, max:999});

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
    // hasMargin: function (asset ,p, q, currentUser, margin, type) {
    //     let sum = 0;
    //     let e = currentUser.assetPositions;
    //     for( let el in e ) {
    //         if( currentUser.assetPositions.hasOwnProperty( el ) ) {
    //             sum += parseFloat( currentUser.assetPositions [el] );
    //         }
    //     }
    //
    //     if (type === "buy"){
    //         return (q < -currentUser.assetPositions[asset]) ?
    //             true :
    //             p * q < margin + currentUser.money - sum
    //
    //     } else if (type === "sell") {
    //         return (q < currentUser.assetPositions[asset]) ?
    //             true :
    //             p * q < margin + currentUser.money + sum
    //     } else {
    //         throw "type argument must equal 'buy' or 'sell'"
    //     }
    // },
    hasMargin: function (asset ,p, q, currentUser, margin, type, closedOffers) {
        let fechado = 0;
        let aberto = currentUser.assetPositions[asset];

        for(let i=0, j=closedOffers.length; i<j; i++) {
            if (closedOffers[i].asset === asset && closedOffers[i].isBuy){
                fechado += closedOffers[i].originalQuantity - closedOffers[i].quantity;
            }
            else if (closedOffers[i].asset === asset && !closedOffers[i].isBuy){
                fechado -= closedOffers[i].originalQuantity - closedOffers[i].quantity;
            }
        }

        if (type === "buy"){

            return fechado + aberto + q <= margin

        } else if (type === "sell") {

            return fechado + aberto - q >= - margin

        } else {
            throw "type argument must equal 'buy' or 'sell'"
        }

    }

};
