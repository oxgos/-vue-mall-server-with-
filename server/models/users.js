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
    addressList: [{
        addressId: String,
        userName: String,
        streetName: String,
        postCode: Number,
        tel: String,
        isDefault: Boolean
    }]
})

var usersModel = mongoose.model('Users', usersSchema)

module.exports = usersModel