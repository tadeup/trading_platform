var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const AssetsOwnedSchema = mongoose.Schema({
    stockA:{
        type: Number,
        min: 0,
        default: 0
    },
    stockB: {
        type: Number,
        min: 0,
        default: 0
    },
    stockC: {
        type: Number,
        min: 0,
        default: 0
    }
});

const UserSchema = mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    money: {
        type: Number,
        min: 0,
        default: 1000
    },
    assetsOwned: {
        type: AssetsOwnedSchema,
        default: AssetsOwnedSchema
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

var User = mongoose.model('User', UserSchema);

module.exports = {User};