const path = require('path');
const utility = require('utility');
const db = require(path.join(__dirname, '../utils/db.js'))
const express = require('express');
const router = express.Router();

router.post('/reguser', async (req, res) => {
    req.body.password = utility.md5(req.body.password);
    let r = await db('insert into user set ?', req.body);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '注册成功' })
    } else {
        res.send({ status: 1, message: '注册失败' })
    }
})


module.exports = router;