const { reply, send } = require("./messageSender");

const {
  createUser,
  updateUser,
  deleteUser,
  getCurrentProvinceNameOfUser,
  searchProvinceByName,
} = require("../data/db");

/**
 * จัดการกับเหตุการณ์ที่เข้ามา ตรวจสอบประเภทของเหตุการณ์ และส่งไปยังฟังก์ชันที่เหมาะสม
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleEvent(event) {
  switch (event.type) {
    case "follow":
      handleFollow(event);
      break;
    case "unfollow":
      handleUnfollow(event);
      break;
    case "message":
      handleMessage(event);
      break;
    default:
      break;
  }
}

/**
 * จัดการกับเหตุการณ์ 'follow'
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleFollow(event) {
  reply(
    event,
    "สวัสดีครับ ผมคือ Weather Bot คุณสามารถเลือกจังหวัดที่ต้องการรับข้อมูลอากาศได้เลยครับ",
    "คุณพี่อยู่จังหวัดอะไรครับ?",
  );
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
function handleMessage(event) {
  if (event.message.type !== "text") {
    reply(event, "ขอโทษครับ ผมไม่เข้าใจข้อความที่คุณส่งมา");
  }

  const newProvince = searchProvinceByName(event.message.text);

  if (newProvince) {
    const currentProvince = getCurrentProvinceNameOfUser(event.source.userId);

    if (currentProvince) {
      updateUser(event.source.userId, newProvince.id);
      reply(
        event,
        `เปลี่ยนจากจังหวัด${currentProvince.name}เป็นจังหวัด${newProvince.name} เรียบร้อย ผมจะส่งข้อมูลอากาศให้คุณทุกวันครับ`,
      );
    } else {
      createUser(event.source.userId, newProvince.id);
      reply(
        event,
        `เลือกจังหวัด${newProvince.name}เรียบร้อย ผมจะส่งข้อมูลอากาศให้คุณทุกวันครับ`,
      );
    }
  } else {
    reply(event, "ขอโทษครับ ผมไม่พบข้อมูลจังหวัดที่คุณส่งมา");
  }
}

module.exports = { handleEvent };
