// 加载模块
const express = require('express');
const path = require('path');
const cors = require('cors');
// 开启服务器
const app = express();
app.listen(3007, () => console.log('开启服务器'));

// 中间件
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/api', require(path.join(__dirname, '/routers/login.js')));
app.use('/my/article', require(path.join(__dirname, '/routers/article.js')));
app.use('/my/article', require(path.join(__dirname, '/routers/category.js')));
app.use('/my', require(path.join(__dirname, '/routers/user.js')));

// 路由