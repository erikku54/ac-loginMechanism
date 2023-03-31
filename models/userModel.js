const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  email: String,
  password: {
    type: String,
    required: true
  }
})

// 把定義的Schema編譯成一個可供操作的model物件，名為Todo
module.exports = mongoose.model('User', todoSchema);
