const express = require('express');
const router = express.Router(); // 引用express路由器

const userModel = require('./../models/userModel');


// 自定義登入驗證機制，利用中介軟體的寫法
// 此中介軟體用來判斷是否為驗證狀態，搭配res.locals的使用把狀態傳給後面的中介

const session = require('./../config/session'); // 引用自定義session模組，儲存session資訊並提供方法
const cookie = require('./../config/cookie'); // 引用自定義cookie模組，提供方法

router.use((req, res, next) => {

  const cookieStr = req.get('Cookie');

  if (!cookieStr) {
    res.locals.isAuthenticated = false; // 沒有cookie即未認證
    return next();
  }

  // 有帶cookie的情況，先解析
  const cookieArr = cookie.parse(cookieStr);
  const cookieSid = cookieArr.find(cookie => cookie.key === 'session_id')

  if (cookieSid === undefined) {
    res.locals.isAuthenticated = false; // 沒找到sid的cookie，驗證失敗
    res.locals.errMsg = '無效的cookie資訊，請重新登入';

    return next();
  }

  // 到session裡面找userId資料
  const sessionId = cookieSid.value;
  const _id = session.getRecord('user_id', sessionId);

  userModel.findOne({ _id })
    .lean()
    .then(user => {
      if (user === null) {
        res.locals.isAuthenticated = false; // db沒有對應的使用者，驗證失敗
        res.locals.errMsg = '使用者資料異常，請重新登入或洽客服';
        return next();
      }

      // db有找到對應資料，驗證成功，在res.locals儲存相關資訊
      res.locals.isAuthenticated = true;
      res.locals.sessionId = sessionId;
      res.locals.user = user;
      return next();
    })

})

// (頁面)登入頁 - 如果已經認證過，直接導向首頁welcome
router.get('/login', (req, res) => {

  if (res.locals.isAuthenticated === true) {
    return res.redirect('/');
  }
  return res.render('login', { message: res.locals.errMsg });

})

// (功能)登入
router.post('/login', (req, res) => {

  userModel.findOne(req.body)
    .then(result => {

      if (result !== null) {
        // 成功登入，紀錄一個record在session裡，並且將cookie存在client端
        // 如果本來就有sessionId會沿用，否則會產生新的

        const sessionId = session.setRecord('user_id', result._id, res.locals.sessionId);
        res.set('Set-Cookie', 'session_id=' + sessionId + ';'); // Max-Age=180;

        return res.redirect('/');

      } else {
        // 登入失敗

        return res.render('login', { message: '錯誤的使用者帳號或密碼，請重新輸入' });
      }
    }).catch(err => console.log(err));

})

// (功能)登出
router.get('/logout', (req, res) => {

  if (res.locals.isAuthenticated === true) {
    session.deleteRecord(res.locals.sessionId); // 刪除session中資料
    res.set('Set-Cookie', 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'); // 設為過去時間可刪除用戶端cookie
  }
  return res.render('login', { message: '你已成功登出' });

})

// (頁面)歡迎頁 - 有認證才可讀
router.get(['/', '/welcome'], (req, res) => {

  if (!res.locals.isAuthenticated) {
    return res.render('login', { message: res.locals.errMsg || '請先登入後瀏覽' });
  }

  return res.render('welcome', { username: res.locals.user.firstName });

})

// (頁面)會員資料 - 有認證才可讀
router.get('/user', (req, res) => {

  if (!res.locals.isAuthenticated) {
    return res.render('login', { message: res.locals.errMsg || '請先登入後瀏覽' });
  }

  return res.render('user', { user: res.locals.user });
})

module.exports = router; // 匯出設定的express路由器
