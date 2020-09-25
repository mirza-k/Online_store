var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const passport = require('passport');
require('../config/passport');
const flash = require('connect-flash');
require('express-validator');
const { body, validationResult } = require('express-validator');

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/orders');

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find()
    .lean()
    .then(docs => {
      var columnNum = 3;
      var productContainer = [];
      for (var i = 0; i < docs.length; i += columnNum) {
        productContainer.push(docs.slice(i, i + columnNum));
      }
      if (req.session.orderDone) {
        var msg = req.flash('success');
        req.session.orderDone = false;
        req.session.cart = null;
      }
      res.render('shop/index.hbs', { title: 'Shopping cart', products: productContainer, message: msg });
    })
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  Product
    .findById(productId, function (err, product) {
      var cart = new Cart(req.session.cart ? req.session.cart : []);
      cart.add(product, productId);
      req.session.cart = cart;
      res.redirect('/')
    })
})

router.get('/cart', function (req, res, next) {
  if (!req.session.cart)
    return res.render('shop/cart', { products: null });
  var products = req.session.cart.items;
  res.render('shop/cart', { products: products, cart: req.session.cart });
})

router.get('/reduce-cart/:id', function (req, res, next) {
  increaseQty(req, res, false);
})

router.get('/increase-cart/:id', function (req, res, next) {
  increaseQty(req, res, true);
})

function increaseQty(req, res, increase) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  if (increase)
    cart.increaseQuantity(productId);
  else
    cart.reduceQuantity(productId);
  req.session.cart = cart;
  res.redirect('/cart');
}

module.exports = router;