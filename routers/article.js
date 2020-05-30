const express = require('express');
const router = express.Router();
const path = require('path');
const db = require(path.join(__dirname, '../utils/db.js'));
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const moment = require('moment');

// 获取文章
router.get('/list', async (req, res) => {
    let pagenum = req.query.pagenum || 1;
    let pagesize = req.query.pagesize || 5;
    let cate_id = req.query.cate_id;
    let state = req.query.state;

    let w = '';
    if (cate_id) {
        w += `cate_id=${cate_id} and `;
    }
    if (state) {
        w += `state='${state}' and `;
    }

    let r = await db(`select a.Id,a.title,a.pub_date,a.state,c.name cate_name from article a join category c on a.cate_id = c.Id
     where ${w} author_id=? 
     limit ${(pagenum - 1) * pagesize}, ${pagesize}`, req.user.id);


    let r2 = await db(`select count(*) total from 
    article a join category c on a.cate_id = c.Id 
    where ${w} author_id=? `, req.user.id);

    if (r && r2) {
        res.status(200).send({ status: 0, message: '获取文章成功', data: r, total: r2[0].total })
    } else {
        res.status(400).send({ status: 1, message: '获取文章失败' })
    }

})

// 添加文章
router.post('/add', upload.single('cover_img'), async (req, res) => {
    let obj = req.body;
    obj.author_id = req.user.id;
    obj.cover_img = req.file.filename;
    obj.pub_date = moment().format('YYYY-MM-DD HH:mm:ss');
    let r = await db('insert into article set ?', obj);
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '发布文章成功！' })
    } else {
        res.status(400).send({ status: 1, message: '发布文章失败！' })
    }
})

// 删除文章
router.get('/delete/:id', async (req, res) => {
    let r = await db('delete from article where Id = ?', req.params.id);
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '删除成功！' })
    } else {
        res.status(400).send({ status: 1, message: '删除失败！' })
    }
})

// 获取文章详情
router.get('/:id', async (req, res) => {

    let r = await db('select * from article where Id=?', req.params.id);
    if (r && r.length > 0) {
        res.status(200).send({ status: 0, message: '获取文章成功！', data: r[0] });
    } else {
        res.status(400).send({ status: 1, message: '获取文章失败！' })
    }
})

// 修改文章
router.post('/edit', upload.single('cover_img'), async (req, res) => {
    let obj = req.body;
    console.log(req.file)
    obj.cover_img = req.file.filename;
    let r = await db('update article set ? where Id =?', [obj, obj.Id])
    if (r && r.affectedRows > 0) {
        res.status(200).send({ status: 0, message: '修改文章成功！' })
    } else { res.status(400).send({ status: 1, message: '修改文章失败！' }) }
})
module.exports = router;