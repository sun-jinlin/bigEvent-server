const express = require('express');
const router = express.Router();
const path = require('path');
const db = require(path.join(__dirname, '../utils/db.js'))

router.get('/list', async (req, res) => {
    let pagenum = req.query.pagenum || 1;
    let pagesize = req.query.pagesize || 8;
    let cate_id = req.query.cate_id;
    let state = req.query.state;
    let w = '';
    if (cate_id) {
        w += `cate_id=${cate_id} and`;
    };
    if (state) {
        w += `state='${state}' and`;
    }

    let r = await db(`select a.Id, a.title, a.pub_date,a.state ,c.name cate_name 
    from article a join category c 
    on a.cate_id = c.Id 
    where ${w} author_id =? 
    limit ${(pagenum - 1) * pagesize},${pagesize}`, req.user.id);

    let r2 = await db(`select count(*) total from article a join category c on a.cate_id = c.Id where ${w} author_id =?`, req.user.id);

    if (r && r2) {
        res.status(200).send({
            status: 0,
            message: '获取文章成功',
            data: r,
            total: r2[0].total
        })
    } else {
        res.status(400).send({ status: 1, message: '获取文章失败' });
    }

})



module.exports = router;