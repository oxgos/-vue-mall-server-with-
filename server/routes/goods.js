var express = require('express')
var router = express.Router()
var goodsModel = require('../models/goods')
var usersModel = require('../models/users')

// 首页产品数据
router.get('/list', (req, res) => {
    // 限定每页的个数
    let pageSize = parseInt(req.query.pageSize, 10)

    // 第几页
    let page = parseInt(req.query.page, 10)

    // 升降序,1升序，-1降序
    let sortby = parseInt(req.query.sort, 10)

    // 总页数
    // let totalPage

    // 忽略的数量
    let skipData = pageSize * (page - 1)

    // 查询价格范围等级
    let priceLevel = req.query.priceLevel

    let startPrice = ''
    let endPrice = ''

    // 查询的参数
    let params = {}

    // 根据价格等级判断价格具体范围
    if (priceLevel !== 'All') {
        switch (priceLevel) {
            case '0':
                startPrice = 0
                endPrice = 100
                break
            case '1':
                startPrice = 100
                endPrice = 500
                break
            case '2':
                startPrice = 500
                endPrice = 1000
                break
            case '3':
                startPrice = 1000
                endPrice = 5000
                break
        }
        params = {
            salePrice: {
                $gt: startPrice,
                $lte: endPrice
            }
        }
    }

    /* goodsModel.find({}, (err, doc) => {
        if (err) {
            console.log(err)
        }
        totalPage = Math.ceil(doc.length / pageSize)
    }) */
    goodsModel
        .find(params)
        .sort({ 'salePrice': sortby })
        .skip(skipData)
        .limit(pageSize)
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message
                })
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        count: doc.length,
                        list: doc
                    }
                })
            }
        })
})

// 购物车数据
router.post('/addCart', (req, res, next) => {
    let userId = '100000077'
    let productId = req.body.productId

    usersModel.findOne({userId: userId}, (err1, user) => {
        if (err1) {
            res.json({
                status: '1',
                msg: err1.message
            })
        } else {
            let goodsItem = ''
            user.cartList.forEach(element => {
                if (element.productId === productId) {
                    goodsItem = element
                    element.productNum ++
                }
            })
            if (goodsItem) {
                user.save((err2, doc) => {
                    if (err2) {
                        res.json({
                            status: '1',
                            msg: err2.message
                        })
                    } else {
                        res.json({
                            status: '0',
                            msg: 'add exist product: ' + doc
                        })
                    }
                })
            } else {
                goodsModel.findOne({productId: productId}, (err3, product) => {
                    if (err3) {
                        res.json({
                            status: '1',
                            msg: err3.message
                        })
                    } else {
                        product._doc.productNum = 1
                        product._doc.checked = 1
                        user.cartList.push(product)
                        user.save((err4, user) => {
                            if (err4) {
                                res.json({
                                    status: '1',
                                    msg: err4.message
                                })
                            } else {
                                res.json({
                                    status: '0',
                                    msg: 'add not exist product: ' + user
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})

module.exports = router