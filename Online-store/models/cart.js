const { Mongoose } = require("mongoose");
var productCart = require('../models/productCart');

module.exports = function Cart(oldCart) {
    this.items = oldCart.items ? oldCart.items : [];
    this.totalQty = oldCart.totalQty ? oldCart.totalQty : 0;
    this.totalPrice = oldCart.totalPrice ? oldCart.totalPrice : 0;

    this.add = function (item, id) {
        var newItem;
        if (this.items.length > 0) {
            var productIndex = this.productAlreadyExists(id);
            newItem = this.items[productIndex];
        }
        if (!newItem) {
            this.items.push(new productCart(id, item, 0, item.price));
            newItem = this.items[this.items.length - 1];
        }
        newItem.qty++;
        this.totalQty++;
        this.totalPrice += newItem.item.price;
    }

    this.reduceQuantity = function (id) {
        var index = this.productAlreadyExists(id);
        if (index != -1){
            this.items[index].qty--;
            this.totalQty--;
            this.totalPrice-=this.items[index].price;
        }
        //removing from view
        if (this.items[index].qty < 1)
            this.items.splice(index, 1);
    }

    this.increaseQuantity = function(id){
        var index = this.productAlreadyExists(id);
        if (index != -1){
            this.items[index].qty++;
            this.totalQty++;
            this.totalPrice+=this.items[index].price;
        }
    }

    this.productAlreadyExists = function (id) {
        for (var i = 0; i < this.items.length; i++) {
            if (id === this.items[i].id)
                return i;
        }
        return -1;
    }
}

