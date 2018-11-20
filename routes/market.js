var express = require('express');
var router = express.Router();

const {buyController} = require('../controllers/market/buy');
const {sellController} = require('../controllers/market/sell');
const {deleteOfferController} = require('../controllers/market/delete');

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

module.exports = router;
