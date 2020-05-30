const express = require('express');
const router = express.Router();
const path = require('path');
const db = require(path.join(__dirname, '../utils/db.js'));


// 获取文章分类
router.get('/cates', async (req, res) => {

    let r = await db('select * from category');

    if (r) {
        res.status(200).send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: r
        })
    } else {
        res.status(400).send({ status: 1, message: '获取文章分类列表失败！' })
    }
})

// 添加文章分类
router.post('/addcates', async (req, res) => {
    let r = await db('insert into category set ?', req.body);
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '新增文章分类成功！' })
    } else {
        res.status(400).send({ status: 1, message: '新增文章分类失败！' })
    }
})

// 删除文章
router.get('/deletecate/:id', async (req, res) => {
    let r = await db('delete from category where Id=?', req.params.id);
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '删除文章分类成功！' });
    } else {
        res.status(400).send({ status: 1, message: '删除文章分类失败！' })
    }
})

// 更新文章

router.post('/updatecate', async (req, res) => {
    let r = await db('update category set ? where Id=? ', [req.body, req.body.Id]);
    if (r && r.affectedRows) {
        res.status(200).send({ status: 0, message: '更新分类信息成功！' });
    } else {
        res.status(400).send({ status: 1, message: '更新分类信息失败！' })
    }
})


module.exports = router;