var express = require('express');
var router = express.Router();
const passport = require('passport');
require('../config/passport');
require('express-validator');
const { body, validationResult } = require('express-validator');

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { messages: messages, hasErrors: messages.length > 0 });
  })
  
  router.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
  ], function (req, res, next) {
    const errors = validationResult(req).errors;
    var messages = [];
    if (errors.length > 0) {
      errors.forEach(error => {
        messages.push(error.msg);
      });
      res.render('user/signup', { messages: messages, hasErrors: errors.length > 0 })
    } else {
      next();
    }
  }, passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }))
  
  router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { messages: messages, hasErrors: messages.length > 0 });
  })
  
  router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }))
  
  router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render('user/profile');
  })
  
  router.get('/logout', isLoggedIn, function (req, res) {
    req.logOut();
    res.redirect('/');
  })
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
  
module.exports = router;