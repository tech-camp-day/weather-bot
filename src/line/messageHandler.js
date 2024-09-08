const { reply } = require("./messageSender");

const {
  createUser,
  updateUser,
  deleteUser,
  getCurrentProvinceNameOfUser,
  searchProvinceByName,
} = require("../data/db");
const MESSAGE_LANG = require("./message");

/**
 * จัดการกับเหตุการณ์ที่เข้ามา ตรวจสอบประเภทของเหตุการณ์ และส่งไปยังฟังก์ชันที่เหมาะสม
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleEvent(lang) {
  const languages = Object.keys(MESSAGE_LANG);
  if (!languages.includes(lang)) {
    console.warn(`Unknown language: ${lang}, using English as default`);
    lang = "en";
  }

  return (event) => {
    const txt = MESSAGE_LANG[lang];
    switch (event.type) {
      case "message":
        handleMessage(event, txt, lang);
        break;
      case "follow":
        handleFollow(event, txt);
        break;
      case "unfollow":
        handleUnfollow(event);
        break;
      default:
        break;
    }
  };
}

/**
 * จัดการกับเหตุการณ์ 'follow'
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleFollow(event, txt) {
  reply(event, txt.HELLO, txt.ASK_PROVINCE);
}

/**
 * จัดการกับเหตุการณ์ 'unfollow'
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleUnfollow(event) {
  deleteUser(event.source.userId);
}

/**
 * จัดการกับเหตุการณ์ 'message'
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleMessage(event, txt, lang) {
  if (event.message.type !== "text") {
    reply(event, txt.SORRY);
    return;
  }

  const newProvince = searchProvinceByName(event.message.text);

  if (newProvince) {
    const currentProvince = getCurrentProvinceNameOfUser(event.source.userId);

    if (currentProvince) {
      updateUser(event.source.userId, newProvince.id);
      reply(event, txt.UPDATE_COMPLETE);
    } else {
      createUser(event.source.userId, newProvince.id, lang);
      reply(event, txt.SELECT_COMPLETE);
    }
  } else {
    reply(event, txt.NO_PROVINCE);
  }
}

module.exports = { handleEvent };
