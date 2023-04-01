const express = require('express');
const router = express.Router(); // 引用express路由器

const userModel = require('./../models/userModel');

// (頁面)首頁
router.get('/', (req, res) => {
  res.render('index');
})

// (頁面)首頁
router.post('/', (req, res) => {

  userModel.findOne(req.body)
    // .lean()
    .then(result => {

      if (result !== null) {
        return res.render('welcome', { username: result.firstName });
      } else {
        return res.render('index', { inactivated: true });
      }

    }).catch(err => console.log(err));
})

module.exports = router; // 匯出設定的express路由器
