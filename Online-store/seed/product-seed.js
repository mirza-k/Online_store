var Product = require('../models/product');
var mongoose = require('mongoose');
const { exists } = require('../models/product');

mongoose.connect('mongodb://localhost:27017/shooping', (err, result) => {
    if (err)
        console.log("error")
    else {
        var products = [
            new Product({
                imagePath: "https://www.cdkeysdeals.com/image/cache/catalog/0Products/0Steam/gta1-500x500.jpg",
                title: 'GTA V',
                description: "Action game.",
                price: 23
            }),
            new Product({
                imagePath: "https://images-na.ssl-images-amazon.com/images/I/61uHV%2BcZc9L._SL1000_.jpg",
                title: 'FIFA 20',
                description: "Football game.",
                price: 35
            }),
            new Product({
                imagePath: "https://images.goodgam.es/03MqYktzTDU/enlarge:1/plain/covers/16-fortnite-cover.jpg@png",
                title: 'Fortnite',
                description: "Battle royale game.",
                price: 15
            }),
            new Product({
                imagePath: "https://images-na.ssl-images-amazon.com/images/I/71cTCvSFJTL._SY500_.jpghttps://images.goodgam.es/03MqYktzTDU/enlarge:1/plain/covers/16-fortnite-cover.jpg@png",
                title: 'PUBG',
                description: "Battle royale game.",
                price: 25
            }),
            new Product({
                imagePath: "https://britgamer.s3.eu-west-1.amazonaws.com/s3fs-public/styles/cover_art/public/2020-03/call-of-duty-warzone-cover.jpg?itok=Z82wocZz",
                title: 'Call Of Duty: Warzone',
                description: "Battle royale game.",
                price: 10
            
            })]

        var counter = 0;
        for (var i = 0; i < products.length; i++) {
            products[i].save().then(()=>{
                counter++;
                if(counter === products.length){
                    mongoose.disconnect();
                }
            })
        }
    }

});



function exit() {
    mongoose.disconnect();
}