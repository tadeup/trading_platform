var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

var User = mongoose.model('User', UserSchema);

module.exports = {User};