// 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('mongodb connected!');
  }).catch((err) => {
    console.log('mongodb error:', err);
  })

const db = mongoose.connection;
module.exports = db;
