var express = require('express');
var router = express.Router();
require('../config/passport');
require('express-validator');
const { body, validationResult } = require('express-validator');

var User = require('../models/user');
var Order = require('../models/orders');


router.get('/', function (req, res, next) {
    var messages = req.flash('error');
    var user = req.user ? req.user.toJSON() : null
    var products = req.session.cart.items;
    res.render('user/order', { products: products, cart: req.session.cart, user: user, messages: messages, hasErrors: messages.length > 0 })
})

router.post('/',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        body('address').not().isEmpty(),
        body('phone').not().isEmpty()
    ], (req, res) => {
        var hasErrors = false;
        var msg;
        const errors = validationResult(req);
        console.log(errors);
        if (errors.errors.length > 0) {
            msg = errors.errors[0].msg;
            hasErrors = true;
            return renderOrder(req, res, msg, hasErrors);
        }
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                return res.send(err);
            }
            if (!user)
                renderOrder(req, res, 'User is not found.', true);
            if (user) {
                if (user.validPassword(req.body.password)) {
                    var newOrder = CreateOrder(user, req.session.cart, req.body.address, req.body.phone)
                    newOrder.save(function (err, user) {
                        if (err) {
                            console.log('error');
                            console.log(err);
                        }
                        req.flash('success', 'Order successful.')
                        req.session.orderDone = true;
                        return res.redirect('/');
                    })
                } else {
                    renderOrder(req, res, 'Password incorrect', true);
                }
            }
        })
    })

function renderOrder(req, res, msg, hasErrors) {
    var user = req.user ? req.user.toJSON() : null;
    var products = req.session.cart.items;
    return res.render('user/order', { products: products, hasErrors: hasErrors, user: user, message: msg });
}

function CreateOrder(user, cart, address, phone) {
    return new Order({
        user: user,
        cart: cart,
        address: address,
        phone: phone
    });
}

module.exports = router;