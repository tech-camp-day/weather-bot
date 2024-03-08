const db = require('better-sqlite3')('weather-bot.db', { verbose: console.log });

/**
 * กำหนดค่าเริ่มต้นให้ฐานข้อมูลโดยการสร้างตารางที่จำเป็นหากยังไม่มีอยู่
 */
const initDb = () => {
  const createProvinceTable = db.prepare(`
      create table if not exists provinces (
        id integer primary key,
        name text
      )
    `);

  const createUserTable = db.prepare(`
      create table if not exists users (
        lineUserId text primary key,
        provinceId integer,
        foreign key(provinceId) references provinces(id)
      )
    `);

  const createAllTables = db.transaction(() => {
    createProvinceTable.run();
    createUserTable.run();
  });

  createAllTables();
};

initDb();

function createUser(lineUserId, provinceId) {
  const insertUser = db.prepare('insert into users (lineUserId, provinceId) values (?, ?)');
  insertUser.run(lineUserId, provinceId);
}

function updateUser(lineUserId, provinceId) {
  const updateUser = db.prepare('update users set provinceId = ? where lineUserId = ?');
  updateUser.run(provinceId, lineUserId);
}

function searchProvinceByName(name) {
  const selectProvince = db.prepare('select id, name from provinces where name = ?');
  return selectProvince.get(name);
}

function getProvincesThatHasUser() {
  const selectProvinces = db.prepare('select distinct p.id, p.name from provinces p join users u on p.id = u.provinceId');
  return selectProvinces.all();
}

function getUserByProvinceId(provinceId) {
  const selectUsers = db.prepare('select lineUserId from users where provinceId = ?');
  return selectUsers.all(provinceId);
}

module.exports = {
  createUser,
  updateUser,
  searchProvinceByName,
  getProvincesThatHasUser,
  getUserByProvinceId
};
