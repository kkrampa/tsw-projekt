var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    var isAuthenticated = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    };

    router.get('/', isAuthenticated, function(req, res) {
        res.render('index', { user: req.user });
    });

    router.get('/login', function(req, res) {
        res.render('login', { message: req.flash('message') });
    });
    
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true  
    }));

    router.get('/register', function(req, res) {
        res.render('register', {message: req.flash('message')});
    });

    router.post('/register', passport.authenticate('register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash : true  
    }));
    
    router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    return router;
};
