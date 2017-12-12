var mongoose = require('mongoose')

var usersSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    userPwd: String,
    orderList: Array,
    cartList: [{
        productId: String,
        productName: String,
        salePrice: String,
        productImage: String,
        productNum: String,
        checked: Number
    }],
    addressList: Array
})

var usersModel = mongoose.model('Users', usersSchema)

module.exports = usersModel