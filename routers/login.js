const path = require('path');
const utility = require('utility');
const db = require(path.join(__dirname, '../utils/db.js'))
const express = require('express');
const router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
// 注册
router.post('/reguser', async (req, res) => {
    req.body.password = utility.md5(req.body.password);
    let r = await db('insert into user set ?', req.body);
    // console.log(r);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '注册成功' })
    } else {
        res.send({ status: 1, message: '注册失败' })
    }
})
// 登录
router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = utility.md5(req.body.password);
    let r = await db('select * from user where username=? and password=?', [username, password]);
    if (r && r.length > 0) {
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + jsonwebtoken.sign(
                { username: req.body.username, id: r[0].id },
                'bigevent',
                { expiresIn: '2days' }
            )
        })
    } else {
        res.send({ status: 1, message: '登录失败' })
    }
})
module.exports = router;