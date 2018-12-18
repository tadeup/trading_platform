const {Stock} = require('../../models/Stocks');
const {User} = require('../../models/Users');

const helpers = require('../../helpers/market');

async function getStockController(req, res, next) {
    let stocks = await Stock.find().exec();

    let contextObj = {
        layout: 'admin',
        stocks,
        active: {
            'stocks': true,
        }};

    res.render('admin/stocks', contextObj);
}

async function postStockController(req, res, next) {
    let {
        body: {
            stockName
        }
    } = req;

    let newStock = new Stock({stockName});

    newStock.save(newStock)
        .then((offer) => {
            helpers.redirectBack('Stock created', true, req, res);
        })
        .catch((e) => {
            console.log(e);
            helpers.redirectBack('Ops! Something went wrong! Please contact admin.', false, req, res);
        });
}

async function deleteStockController(req, res, next) {
    let {
        body: {
            stockId
        }
    } = req;
    Stock.findByIdAndDelete(stockId)
        .then((stock) => {
            if (stock){
                res.status(200).send("stock deleted");
            } else {
                res.status(404).send("stock not found");
            }
        })
        .catch((e) => {
            console.log(e);
            res.status(400).send("Ops! Something went wrong! Please contact admin.");
        });
}

async function updateStocksController(req, res, next) {
    Stock.find()
    .then(stocks => {
        return User.updateAssets(stocks)
    }).then(a =>{
        res.status(200).send("stocks updated!");
    }).catch(e => {
        console.log(e);
        res.status(400).send("Ops! Something went wrong! Please contact admin.");
    });

}

module.exports = {getStockController, postStockController, deleteStockController, updateStocksController};