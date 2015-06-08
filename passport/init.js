//jshint devel: true, node: true
var bCrypt = require('bcrypt');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
 
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
    
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
    passport.use('register', new LocalStrategy({
        passReqToCallback : true
    }, function(req, username, password, done) {
        var findOrCreateUser = function(){
          // find a user in Mongo with provided username
          User.findOne({'username': username},function(err, user) {
            // In case of any error return
            if (err){
              return done(err);
            }
            // already exists
            if (user) {
              return done(null, false, 
                 req.flash('message', 'Użytkownik o podanej nazwie już istnieje!'));
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();
              // set the user's local credentials
              newUser.password = createHash(password);
              newUser.username = username;

              // save the user
              newUser.save(function(err) {
                if (err){
                  throw err;  
                }
                console.log('Rejestracja powiodła się!');    
                return done(null, newUser);
              });
            }
          });
        };

        process.nextTick(findOrCreateUser);    
    }));
    
    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user){
                        return done(null, false, req.flash('message', 'Użytkownik o podanej nazwie nie został znaleziony.'));                 
                    }
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Nieprawidłowe hasło')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );
    
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };

                                            

};
        
                                    