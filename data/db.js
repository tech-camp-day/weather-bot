const db = require('better-sqlite3')('weather-bot.db', { verbose: console.log });

/**
 * กำหนดค่าเริ่มต้นให้ฐานข้อมูลโดยการสร้างตารางที่จำเป็นหากยังไม่มีอยู่
 */
const initDb = () => {
  const createVocabTable = db.prepare(`
      create table if not exists vocabs (
        id integer primary key autoincrement,
        word text not null,
        meaning text not null
      )
    `);

  const createAllTables = db.transaction(() => {
    createVocabTable.run();
    createUserTable.run();
    createUserHistoryTable.run();
  });

  createAllTables();
};

module.exports = { initDb };