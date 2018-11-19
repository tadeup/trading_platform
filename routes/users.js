var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const {User} = require('../models/Users');

//const User = mongoose.model('Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('USERS PAGE');
});

router.get('/register', function (req, res) {
  res.render('users/register');
});

router.get('/login', function (req, res) {
    // equivalent to 'if (!req.user) {'
    if (!req.isAuthenticated()) {
        res.render('users/login');
    } else {
        return res.redirect('/dashboard');
    }
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
            if(err) {
                req.flash('error_msg', 'User or email not unique');
                res.redirect('back');
            } else {
                req.flash('success_msg', 'You are registered and can now login');
                res.redirect('/users/login');
            }
        });
    }
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    function(email, password, done) {
        User.getUserByEmail(email, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

module.exports = router;
