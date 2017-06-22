'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var mongoose = require("mongoose");

var Promise = require("bluebird");


//Promise.promisifyAll(mongoose);
Promise.promisifyAll(require("mongoose"));

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
        profileFields: [ 'email' , 'name' ]
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
              'facebook.id': profile.id
            },
      function(err, user) {
        //console.log('accessToken=' + accessToken);
        //console.log('czy user jest w bazie= ' + JSON.stringify(user));
        if (err) {
          return done(err);
        }
        if (!user) {
          //console.log(JSON.stringify(profile));
          user = new User({
            name: profile.name.givenName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });

          user.saveAsync()
              .then(function(obj, numaffected) {
                console.log('obj=' + JSON.stringify(obj));
                console.log('numaffected=' + JSON.stringify(numaffected));

                //savedPerson will be the person
                //you may omit the second argument if you don't care about it
                console.log(JSON.stringify(obj));
                done(null, obj);
              })
              .catch(function(err) {
                console.log("There was an error = " + err);
              });

        } else {
          return done(err, user);
        }
      })
    }
  ));
};
