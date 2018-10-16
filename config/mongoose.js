const mongoose = require('mongoose');

// Configure enviroment varibles
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
    process.env.MONGODB_URI ='mongodb://localhost:27017/trading';
} else if (env === 'test'){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/tradingTest';
}

//Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(process.env.MONGODB_URI);
// mongoose.set('debug', true);

module.exports = {
    mongoose
};