var express = require('express');
var router = express.Router();

const {pricesController} = require('../controllers/admin/prices');
const {studentsController} = require('../controllers/admin/students');
const {
    getStockController,
    postStockController,
    deleteStockController,
    updateStocksController,
    finalPriceController
} = require('../controllers/admin/stocks');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { layout: 'admin' });
});

router.get('/students', studentsController);

router.get('/prices', pricesController);

router.get('/stocks', getStockController);

router.post('/stocks', postStockController);

router.delete('/stocks', deleteStockController);

router.post('/updatestocks', updateStocksController);

router.post('/finalprice', finalPriceController);

module.exports = router;
