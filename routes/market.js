var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/buy', function(req, res, next) {
    res.status(501).send("Under construction");
});

module.exports = router;
