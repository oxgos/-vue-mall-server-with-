var express = require('express')
var router = express.Router()
var goodsModel = require('../models/goods')

router.get('/', (req, res) => {
    // 限定每页的个数
    let count = 3

    // 第几页
    let index = parseInt(req.query.page, 10)

    // 升降序
    let sortby = parseInt(req.query.sort, 10)

    // 总页数
    let totalPage

    // 忽略的数量
    let skipData = count * (index - 1)

    goodsModel.find({}, (err, doc) => {
        if (err) {
            console.log(err)
        }
        totalPage = Math.ceil(doc.length / count)
    })

    if (sortby) {
        goodsModel
            .find({})
            .sort({ 'salePrice': sortby })
            .skip(skipData)
            .limit(count)
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
                            count: totalPage,
                            list: doc
                        }
                    })
                }
            })
    } else {
        goodsModel.find({}, (err, doc) => {
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
    }
})

module.exports = router