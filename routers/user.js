const express = require('express');
const router = express.Router();
const path = require('path');
const utility = require('utility');
const db = require(path.join(__dirname, '../utils/db.js'))

// 获取用户信息
router.get('/userinfo', async (req, res) => {
    let r = await db('select * from user where id=?', req.user.id);
    if (r && r.length > 0) {
        r[0].password = undefined;
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: r[0]
        })
    } else {
        res.send({ status: 1, message: '获取用户基本信息失败！' })
    }

})

// 更新密码
router.post('/updatepwd', async (req, res) => {
    let oldPwd = utility.md5(req.body.oldPwd);
    let newPwd = utility.md5(req.body.newPwd);
    if (oldPwd === newPwd) {
        return res.send({ status: 1, message: '旧密码不能与新密码重复' });
    }
    let r = await db('update user set password=? where id=? and password =?', [newPwd, req.user.id, oldPwd]);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '更新密码成功！' });
    } else {
        res.send({ status: 1, message: '原密码输入错误' });
    }
})

// 更换头像
router.post('/update/avatar', async (req, res) => {
    let r = await db('update user set user_pic=? where id=? ', [req.body.avatar, req.user.id]);
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '更新头像成功！' })
    } else {
        res.status(400).send({ status: 1, message: '更新头像失败' });
    }
})

//更新用户的基本信息

router.post('/userinfo', async (req, res) => {
    if (req.body.id != req.user.id) {
        return res.status(400).send({ status: 0, message: 'id错误，请重新登录！' })
    }
    let r = await db('update user set ? where id=?', [req.body, req.user.id])
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '修改用户信息成功！' })
    } else {
        res.status(400).send({ status: 1, message: '修改用户信息失败！' })
    }
})

module.exports = router;