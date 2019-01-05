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
            stockName,
            continuo
        }
    } = req;

    let newStock = new Stock({stockName, continuo});

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
    let {
        body: {
            hard
        }
    } = req;

    if (hard == true) {
        Stock.find()
            .then(stocks => {
                return User.hardUpdateAssets(stocks)
            }).then(a =>{
            res.status(200).send("stocks updated!");
        }).catch(e => {
            console.log(e);
            res.status(400).send("Ops! Something went wrong! Please contact admin.");
        });
    } else {
        let users, stocks;
        [users, stocks] = await Promise.all([User.find().exec(), Stock.find().exec()]);
        let updates = [];
        users.forEach(user => {
            let finalStocks = {};
            stocks.forEach(arrayItem => {
                if (arrayItem.continuo) {
                    finalStocks[arrayItem.stockName] = user.assetPositions[arrayItem.stockName]
                } else {
                    finalStocks[arrayItem.stockName] = 0
                }
            });
            let userUpdatePromise = User.findByIdAndUpdate(user._id, {assetPositions: finalStocks});
            updates.push(userUpdatePromise);
        });
        Promise.all(updates)
            .then(() => {
                res.status(200).send("stocks updated!");
            }).catch((e) => {
                console.log(e);
                res.status(400).send("Ops! Something went wrong! Please contact admin.");
            });
    }


}

module.exports = {getStockController, postStockController, deleteStockController, updateStocksController};