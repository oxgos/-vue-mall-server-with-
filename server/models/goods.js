var mongoose = require('mongoose')

var goodsSchema = new mongoose.Schema({
    'productId': String,
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productUrl': String
})

var goodsModel = mongoose.model('goods', goodsSchema)

module.exports = goodsModel