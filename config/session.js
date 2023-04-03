
// records存放 session-data供cookie比對用
// 每一個record預計有3欄: key, value, sessionId
// setRecord，getRecord，deleteRecord是負責紀錄，讀取，刪除的方法

const session = (() => {

  const records = [];

  const setRecord = function (key, value, sessionId) {
    // 如果sessionId沒有傳進來或是undefined，就生成一個
    if (!sessionId) {
      sessionId = _getSessionId();
    }

    // 先確認本來是否已存在同id同key的紀錄，有就更新，沒有才新增
    const targetRecord = records.find(record => record.key === key && record.sessionId === sessionId);
    if (targetRecord !== undefined) {
      targetRecord.value = value;
    } else {
      records.push({ key, value, sessionId });
    }

    return sessionId;
  };


  const getRecord = function (key, sessionId) {
    // 如果找到資料就回傳，否則回傳undefined
    const targetRecord = records.find(record => record.key === key && record.sessionId === sessionId);

    if (targetRecord !== undefined) {
      return targetRecord.value;
    } else {
      return undefined;
    }
  };


  const deleteRecord = function (sessionId) {
    // 刪除此sessionId的所有紀錄
    // records = records.filter(record => record.sessionId !== sessionId);

    let targetIndex = records.findIndex(record => record.sessionId === sessionId);
    while (targetIndex !== -1) {
      records.splice(targetIndex, 1);
      targetIndex = records.findIndex(record => record.sessionId === sessionId);
    }
  };


  const _getSessionId = function () {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

    // 產生5位數code
    let sessionId = '';
    for (let i = 0; i < 5; i++) {
      sessionId += pool[Math.floor(Math.random() * pool.length)].toString();
    }

    // 如果重複就再產生
    while (records.some(record => record.sessionId === sessionId)) {
      sessionId = '';
      for (let i = 0; i < 5; i++) {
        sessionId += pool[Math.floor(Math.random() * pool.length)].toString();
      }
    }
    return sessionId;
  }

  return { setRecord, getRecord, deleteRecord };

})();

module.exports = session;
