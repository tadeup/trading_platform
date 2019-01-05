// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg', 'Please login');
        res.redirect('/users/login');
    }
}

function ensureAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    } else {
        req.flash('error_msg', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = {ensureAuthenticated, ensureAdmin};