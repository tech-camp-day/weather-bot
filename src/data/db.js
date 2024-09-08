const db = require("better-sqlite3")("./db/weather-bot.db", {
  verbose: console.log,
});
const provinces = require("./provinces.json");

const initDb = () => {
  const createProvinceTable = db.prepare(`
      create table if not exists provinces (
        id integer primary key,
        name text,
        latitude real,
        longitude real
      )
    `);

  const createProvinceAliasTable = db.prepare(`
      create table if not exists province_aliases (
        id integer primary key autoincrement,
        alias text,
        provinceId integer,
        foreign key(provinceId) references provinces(id)
      )
    `);

  const createUserTable = db.prepare(`
      create table if not exists users (
        lineUserId text primary key,
        provinceId integer,
        lang text,
        foreign key(provinceId) references provinces(id)
      )
    `);

  const createAllTables = db.transaction(() => {
    createProvinceTable.run();
    createUserTable.run();
    createProvinceAliasTable.run();

    const insertProvinces = db.prepare(
      "insert or ignore into provinces (id, name, latitude, longitude) values (?, ?, ?, ?)"
    );
    const insertProvinceAliases = db.prepare(
      "insert or ignore into province_aliases (alias, provinceId) values (?, ?)"
    );
    provinces.forEach(({ id, name, latitude, longitude, aliases }) => {
      insertProvinces.run(id, name, latitude, longitude);

      aliases.forEach((alias) => {
        insertProvinceAliases.run(alias, id);
      });
    });
  });

  createAllTables();
};

initDb();

/**
 * สร้างผู้ใช้ใหม่ในฐานข้อมูล
 * @function createUser
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 * @param {number} provinceId - ไอดีของจังหวัดที่ผู้ใช้ต้องการ
 */
function createUser(lineUserId, provinceId, lang) {
  const insertUser = db.prepare(
    "insert into users (lineUserId, provinceId, lang) values (?, ?, ?)"
  );
  insertUser.run(lineUserId, provinceId, lang);
}

/**
 * อัปเดตไอดีจังหวัดของผู้ใช้ในฐานข้อมูล
 * @function updateUser
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 * @param {number} provinceId - ไอดีใหม่ของจังหวัดที่ผู้ใช้ต้องการ
 */
function updateUser(lineUserId, provinceId) {
  const updateUser = db.prepare(
    "update users set provinceId = ? where lineUserId = ?"
  );
  updateUser.run(provinceId, lineUserId);
}

/**
 * ลบผู้ใช้จากฐานข้อมูล
 * @function deleteUser
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 */
function deleteUser(lineUserId) {
  const deleteUser = db.prepare("delete from users where lineUserId = ?");
  deleteUser.run(lineUserId);
}

/**
 * ดึงชื่อจังหวัดปัจจุบันของผู้ใช้
 * @function getCurrentProvinceNameOfUser
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 * @returns {string} ชื่อจังหวัดปัจจุบันของผู้ใช้
 */
function getCurrentProvinceNameOfUser(lineUserId) {
  const selectUser = db.prepare(
    "select p.name from provinces p join users u on p.id = u.provinceId where u.lineUserId = ?"
  );
  return selectUser.get(lineUserId);
}

/**
 * ค้นหาจังหวัดตามชื่อ
 * @function searchProvinceByName
 * @param {string} name - ชื่อจังหวัดที่ต้องการค้นหา
 * @returns {object} ออบเจ็กต์จังหวัดที่มีไอดีและชื่อ
 */
function searchProvinceByName(name) {
  const selectProvince = db.prepare(
    "select provinceId from province_aliases where alias = ?"
  );
  return selectProvince.get(name);
}

/**
 * ดึงข้อมูลจังหวัดทั้งหมดที่มีผู้ใช้อย่างน้อย 1 คน
 * @function getProvincesThatHasUser
 * @returns {Array} อาร์เรย์ของออบเจ็กต์จังหวัดที่มีไอดีและชื่อ
 */
function getProvincesThatHasUser() {
  const selectProvinces = db.prepare(
    "select distinct p.id as id, p.name as name, latitude, longitude from provinces p join users u on p.id = u.provinceId"
  );
  return selectProvinces.all();
}

/**
 * ดึงผู้ใช้ทั้งหมดที่เป็นสมาชิกของจังหวัดที่กำหนด
 * @function getUserByProvinceId
 * @param {number} provinceId - ไอดีของจังหวัด
 * @returns {Array} อาร์เรย์ของไอดีผู้ใช้ของ Line
 */
function getUserByProvinceId(provinceId) {
  const selectUsers = db.prepare(
    "select lineUserId, lang from users where provinceId = ?"
  );
  return selectUsers.all(provinceId);
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getCurrentProvinceNameOfUser,
  searchProvinceByName,
  getProvincesThatHasUser,
  getUserByProvinceId,
};
