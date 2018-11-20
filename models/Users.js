var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

const {constants} = require('../config/constants');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    money: {
        type: Number,
        min: 0,
        default: constants.initialMoney
    },
    assetPositions: {
        stockA:{
            type: Number,
            min: -100,
            default: constants.initialStockA
        },
        stockB: {
            type: Number,
            min: -100,
            default: constants.initialStockB
        },
        stockC: {
            type: Number,
            min: -100,
            default: constants.initialStockC
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.statics.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

UserSchema.statics.getUserByEmail = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

UserSchema.statics.getUserById = function (id, callback) {
    User.findById(id, callback);
};

UserSchema.statics.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

UserSchema.plugin(uniqueValidator);

var User = mongoose.model('User', UserSchema);

module.exports = {User};