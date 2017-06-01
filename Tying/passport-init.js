var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user._id);
        //return the unique id for the user
        return done(null, user._id);
    });

    //Desieralize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function (username, done) {
        User.findById(id, function (err, user) {
            // if err on request --> fail
            if (err) {
                return done(err, false);
            }

            // if user not found --> fail
            if (!user) {
                return done('User not found', false);
            }

            // user found
            return done(user, true);
        });
    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {

            User.findOne({ username: username }, function (err, user) {

                // if err on request --> fail
                if (err) {
                    return done(err, false);
                }

                // if user not found --> fail
                if (!user) {
                    return done('User' + username + 'not found', false);
                }

                // if password is not valid --> fail
                if (!isValidPassword(user, password)) {
                    return done('Incorrect password ', false);
                }

                //sucessfully authenticated
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
        // allows us to pass back the entire request to the callback
        passReqToCallback: true
    },

        function (req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                // If err on request --> fail
                if (err) {
                    return done(err, false);
                }

                // If user already exists --> fail
                if (user) {
                    // we have already signed this user up
                    return done('username already taken', false);
                }

                // If everything ok --> create user
                var user = new User();
                user.username = username;
                user.password = createHash(password);
                user.save(function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    console.log('sucessfully signed up user' + username);
                    return done(null, user);
                });
            });
        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};