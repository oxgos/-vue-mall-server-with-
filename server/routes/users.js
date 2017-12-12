var express = require('express')
var router = express.Router()
var User = require('../models/users')

// 注册
router.post('/signup', (req, res) => {
    let username = req.body.username
    let userPwd = req.body.pwd

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

module.exports = router