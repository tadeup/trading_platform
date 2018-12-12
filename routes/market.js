module.exports = function (io) {
    var express = require('express');
    var router = express.Router();

    const buyController = require('../controllers/market/buy')(io);
    const sellController = require('../controllers/market/sell')(io);
    const deleteOfferController = require('../controllers/market/delete')(io);

    /* POST new buy offer */
    router.post('/buy', buyController);

    router.post('/sell', sellController);

    router.delete('/delete/:offerType/:offerId', deleteOfferController);

    router.get('/profile', function(req, res, next) {

        //here it is
        var user = req.user;

        //you probably also want to pass this to your view
        res.send(user);
    });

    return router
};