var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var goodsModel = require('../models/goods.js')

mongoose.connect('mongodb://127.0.0.1:27017/vuemall')

mongoose.connection.on('connected', () => {
    console.log('Mongodb connected success')
})
mongoose.connection.on('error', () => {
    console.log('Mongodb connected failed')
})
mongoose.connection.on('disconnected', () => {
    console.log('Mongodb connected disconnected')
})

router.get('/', (req, res) => {
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
})

module.exports = router