var express = require('express')
var router = express.Router()
var goodsModel = require('../models/goods')

router.get('/', (req, res) => {
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

module.exports = router