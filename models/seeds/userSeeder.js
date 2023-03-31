
// setting
const db = require('./../../config/mongoose'); // db connection
const userModel = require('./../userModel'); // db Model
const users = require('./users'); // seed data

db.once('open', () => {

  // 對每個user個別執行create
  const createPromises = users.map(user =>
    userModel.create(user)
      .then(() => console.log('user created!')));

  // 當所有Promise完成時，列印訊息
  Promise.all(createPromises)
    .then(() => console.log('all seed data have been created successfully.'))
    .catch(err => console.error(err));
})
