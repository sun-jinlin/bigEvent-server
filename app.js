// 加载模块
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
// 开启服务器
const app = express();
app.listen(3007, () => console.log('开启服务器'));

// 中间件
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads'));
app.use(jwt({ secret: 'bigevent' }).unless({ path: /^\/api/ }))

// 路由
app.use('/api', require(path.join(__dirname, '/routers/login.js')));
app.use('/my/category', require(path.join(__dirname, '/routers/category.js')));
app.use('/my/article', require(path.join(__dirname, '/routers/article.js')));
app.use('/my', require(path.join(__dirname, '/routers/user.js')));

// 错误处理中间件
app.use((err, req, res, next) => {
    console.log(err.message);
    if (err.naem = 'UnauthorizedError') {
        res.status(401).send({ status: 1, message: '身份认证失败' })
    }
})
