
const cookie = (() => {

  // cookie.parse可以用來拆分cookie字串，把他轉為一個{key, value}的陣列
  const parse = function (str) {
    const strArr = str.split(';');

    const objArr = [];

    strArr.forEach(str => {
      const arr = str.trim().split('=');
      objArr.push({ key: arr[0], value: arr[1] });
    })

    return objArr;
  }

  return { parse };
})();

module.exports = cookie;
