var mongoose = require('mongoose');

var orders = new mongoose.Schema({
    user: {type : mongoose.Schema.Types.ObjectId, required:true, ref : 'User'},
    cart: {type : Object, required:true},
    address: {type:String, required:true},
    phone: {type:String, required:true}
})

module.exports = mongoose.model('Order',orders);
