async function xmarketController(req, res, next) {
    Offer.find()
        .where({isBuy: false})
        .where({quantity: {$gt: 0}})
        .sort({price:1})
        .exec(function (err, sellOffers) {
            if(err){
                console.log(err);
            } else {
                Offer.find()
                    .where({isBuy: true})
                    .where({quantity: {$gt: 0}})
                    .sort({price:-1})
                    .exec(function (err, buyOffers) {
                        if(err){
                            console.log(err);
                        } else {
                            const UserOffersBuy = buyOffers
                                .filter(offer => `${offer.ownerId}` === `${req.user._id}`);
                            const UserOffersSell = sellOffers
                                .filter(offer => `${offer.ownerId}` === `${req.user._id}`);

                            var contextObj = {
                                layout: 'dashboard',
                                sellOffers,
                                buyOffers,
                                UserOffersBuy,
                                UserOffersSell,
                                assetName,
                                currentUser: req.user,
                                positionOnAsset: req.user.assetPositions[`${assetName}`],
                                active: {
                                    'market': true,
                                }};
                            contextObj.active[`${assetName}`] = true;
                            res.render('dashboard/market', contextObj);
                        }
                    });
            }
        });
}

module.exports = {xmarketController};