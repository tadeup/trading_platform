var express = require('express');
var router = express.Router();

const {User} = require('../models/Users');

//const User = mongoose.model('Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res) {
  res.render('register');
});

router.get('/login', function (req, res) {
  res.render('login')
});

router.post('/register', function (req, res) {
    var {body: {
        name,
        email,
        username,
        password,
        password2
    }} = req;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors){
        res.render('register', {
            errors
        });
    } else {
        var newUser = new User({
            name, email, username, password
        });

        User.createUser(newUser, function (err, user) {
            if(err) console.log(err);
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

module.exports = router;
