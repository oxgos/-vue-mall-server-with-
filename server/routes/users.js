var express = require('express')
var router = express.Router()
var User = require('../models/users')
require('../util/format')

// 注册
router.post('/signup', (req, res) => {
    let username = req.body.username
    let userPwd = req.body.pwd

    User.findOne({ userName: username }, (err, doc) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: 'user have been registered'
                })
            } else {
                var user = new User({
                    userId: '100000011',
                    userName: username,
                    userPwd: userPwd,
                    orderList: [],
                    carList: {},
                    addressList: []
                })
                user.save((err) => {
                    if (err) throw err
                    res.json({
                        status: '0',
                        msg: 'user have been created'
                    })
                })
            }
        }
    })
})

// 登陆
router.post('/login', (req, res) => {
    var params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }

    User.findOne(params, (err, user) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (user) {
                res.cookie('userId', user.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                })
                res.cookie('userName', user.userName, {
                        path: '/',
                        maxAge: 1000 * 60 * 60
                    })
                    // req.session.user = user
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        userName: user.userName
                    }
                })
            }
        }
    })
})

// 登出
router.post('/logout', (req, res) => {
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    })
    res.json({
        status: '0',
        msg: '',
        result: req.cookies.userName + ' have logout'
    })
})

// 检查是否已登陆
router.get('/checklogin', (req, res) => {
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '已登陆',
            result: req.cookies.userName || ''
        })
    } else {
        res.json({
            status: '1',
            msg: '未登陆',
            result: ''
        })
    }
})

// 用户购物车列表
router.get('/cartList', (req, res) => {
    let userId = req.cookies.userId
    User.findOne({ 'userId': userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: 'success',
                    result: doc.cartList
                })
            }
        }
    })
})

// 商品全选
router.post('/selectAll', (req, res) => {
    let userId = req.cookies.userId
    let checked = req.body.checked

    /* 
    可能mongosse还不支持mongodb 3.6的新特性，以后再尝试
    User.update({ 'userId': userId }, { $set: { 'cartList.$[].checked': checked } }, { multi: true }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc
                })
            }
        }
    }) */

    User.findOne({ 'userId': userId }, (err, user) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (user) {
                user.cartList.forEach((item) => {
                    item.checked = checked
                })
                user.save((err1, doc) => {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        if (doc) {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            })
                        }
                    }
                })
            }
        }
    })
})

// 修改商品信息
router.post('/editPro', (req, res) => {
    let userId = req.cookies.userId
    let productId = req.body.productId
    let productNum = req.body.productNum
    let checked = req.body.checked
    User.update({ 'userId': userId, 'cartList.productId': productId }, {
        $set: {
            'cartList.$.productNum': productNum,
            'cartList.$.checked': checked
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'ok'
                })
            }
        }
    })
})

// 删除购物车商品
router.delete('/removePro', (req, res) => {
    let userId = req.cookies.userId
    let productId = req.query.productId
        // 利用update的$pull进行删除
    User.update({ 'userId': userId }, {
            $pull: {
                cartList: {
                    productId: productId
                }
            }
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                res.json({
                    status: '0',
                    msg: 'delete success',
                    result: ''
                })
            }
        })
        // 原始方法遍历查找删除
        /* User.findOne({ userId: userId }, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (doc) {
                    var current
                    doc.cartList.forEach((item, index) => {
                        if (item.productId === productId) {
                            current = index
                        }
                    })
                    doc.carList = doc.cartList.splice(current, 1)
                    doc.save((err, doc) => {
                        if (err) {
                            res.json({
                                status: '1',
                                msg: err.message,
                                result: ''
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'delete done'
                            })
                        }
                    })
                }
            }
        }) */
})

// 地址列表
router.get('/address', (req, res) => {
    let userId = req.cookies.userId
    User.findOne({ userId: userId }, (err, user) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: user.addressList
            })
        }
    })
})

// 删除地址
router.delete('/address/remove', (req, res) => {
    let userId = req.cookies.userId
    let addressId = req.query.addressId
    User.update({ userId: userId }, {
        $pull: {
            addressList: {
                addressId: addressId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'delete done'
                })
            }
        }
    })
})

// 修改默认地址
router.post('/address/setDefault', (req, res) => {
    let userId = req.cookies.userId
    let addressId = req.body.productId
    User.findOne({ userId: userId }, (err, user) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (user) {
                user.addressList.forEach((item) => {
                    if (item.addressId === addressId) {
                        item.isDefault = true
                    } else {
                        item.isDefault = false
                    }
                })
                user.save((err1, doc) => {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        if (doc) {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'set done'
                            })
                        }
                    }
                })
            }
        }
    })
})

// 创建支付订单
router.post("/payMent", function(req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId,
        orderTotal = req.body.orderTotal
    User.findOne({ userId: userId }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            var address = '',
                goodsList = []
                //获取当前用户的地址信息
            doc.addressList.forEach((item) => {
                    if (addressId == item.addressId) {
                        address = item
                    }
                })
                //获取用户购物车的购买商品
            doc.cartList.filter((item) => {
                if (item.checked == '1') {
                    goodsList.push(item)
                }
            })

            var platform = '622'
            var r1 = Math.floor(Math.random() * 10)
            var r2 = Math.floor(Math.random() * 10)

            var sysDate = new Date().Format('yyyyMMddhhmmss')
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
            var orderId = platform + r1 + sysDate + r2
            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: '1',
                createDate: createDate
            }

            User.update({ userId: userId }, {
                $push: {
                    orderList: order
                }
            }, (err1, doc1) => {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: err1.message,
                        result: ''
                    })
                } else {
                    if (doc1) {
                        res.json({
                            status: '0',
                            msg: '',
                            result: {
                                orderId: orderId,
                                orderTotal: orderTotal
                            }
                        })
                    }
                }
            })
        }
    })
})

// 查询已支付订单
router.get('/orderDetail', (req, res) => {
    let userId = req.cookies.userId
    let orderId = req.query.orderId
    User.findOne({ userId: userId }, (err, user) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            if (user) {
                user.orderList.forEach((item) => {
                    if (item.orderId === orderId) {
                        res.json({
                            status: "0",
                            msg: '',
                            result: item.orderTotal
                        })
                    }
                })
            }
        }
    })
})

module.exports = router