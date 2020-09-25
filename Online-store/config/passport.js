var passport = require('passport');
require('passport');
var User = require('../models/user');
const { mongo, Mongoose } = require('mongoose');
// const { validationResult } = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })
})

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        } if (user) {
            return done(null, false, { message: 'Email already exists.' });
        }
        console.log('testttt');
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err)
            }
            return done(null, newUser);
        })
    })
}))

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err)
        }
        if (!user) {
            console.log('mail')
            return done(null, false, { message: 'No user found.' });
        }   
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    })
}))
