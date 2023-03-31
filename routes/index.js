const express = require('express');
const router = express.Router(); // 引用express路由器

router.get('/', (req, res) => {
  res.render('index');
})

module.exports = router; // 匯出設定的express路由器
