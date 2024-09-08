const cron = require("node-cron");
const { DateTime } = require("luxon");

const { sendMulticast } = require("./messageSender");
const { getProvincesThatHasUser, getUserByProvinceId } = require("../data/db");
const {
  getDailyWeatherByLatLon,
  getTodaysHourlyWeatherCodeByLatLon,
} = require("../weather/openmeteo");

const weatherCodeDescr = require("../weather/weatherCodes");
const MESSAGE_LANG = require("./message");

/**
 * ส่งการแจ้งเตือนสภาพอากาศให้กับผู้ใช้ในจังหวัดที่กำหนดตามเงื่อนไขของสภาพอากาศ
 * ดึงรหัสสภาพอากาศและโอกาสฝนตกสำหรับแต่ละจังหวัด
 * และส่งการแจ้งเตือนให้กับผู้ใช้หากสภาพอากาศคาดว่าจะแย่ลงในชั่วโมงถัดไป
 *
 * @returns {Promise<void>} Promise ที่ resolve เมื่อส่งการแจ้งเตือนทั้งหมดเสร็จสิ้น
 */
async function alertBadWeather() {
  console.log("alertBadWeather started!");
  const provinces = getProvincesThatHasUser();

  for (const province of provinces) {
    const { weatherCodes, precipitationProbabilities } =
      await getTodaysHourlyWeatherCodeByLatLon(
        province.latitude,
        province.longitude
      );

    const currentHour = DateTime.now().setZone("Asia/Bangkok").hour;

    if (
      !isWeatherCodeBad(weatherCodes[currentHour]) &&
      isWeatherCodeBad(weatherCodes[currentHour + 1])
    ) {
      const users = getUserByProvinceId(province.id);
      const usersByLang = users.reduce((acc, user) => {
        acc[user.lang] = acc[user.lang] || [];
        acc[user.lang].push(user.lineUserId);
        return acc;
      }, {});

      for (const lang in usersByLang) {
        const lineUserIds = usersByLang[lang];
        const weatherDescription =
          weatherCodeDescr[lang][weatherCodes[currentHour + 1]];
        const precipitationProbability =
          precipitationProbabilities[currentHour + 1];
        const message = MESSAGE_LANG[lang].WEATHER_ALERT.replace(
          "{weatherDescription}",
          weatherDescription
        ).replace("{preciptationProbability}", precipitationProbability);

        sendMulticast(lineUserIds, message);
      }
    }
  }
}

/**
 * ตรวจสอบว่ารหัสสภาพอากาศแสดงถึงสภาพอากาศที่ไม่ดีหรือไม่
 * @param {number} weatherCode - รหัสสภาพอากาศที่ต้องการตรวจสอบ
 * @returns {boolean} - คืนค่า true ถ้ารหัสสภาพอากาศแสดงถึงสภาพอากาศที่ไม่ดี มิฉะนั้นคืนค่า false
 */
function isWeatherCodeBad(weatherCode) {
  return weatherCode === 9 || weatherCode === 17 || weatherCode >= 20;
}

cron.schedule("15 * * * *", alertBadWeather, { timezone: "Asia/Bangkok" });

/**
 * สร้างรายงานสภาพอากาศประจำวันสำหรับแต่ละจังหวัดและส่งไปยังผู้ใช้ Line ที่เกี่ยวข้อง
 * @returns {Promise<void>} Promise ที่ resolve เมื่อส่งรายงานสภาพอากาศเสร็จสิ้น
 */
async function dailyReport() {
  console.log("dailyReport started!");
  const provinces = getProvincesThatHasUser();

  for await (const province of provinces) {
    const {
      weatherCode,
      temperature2mMax,
      temperature2mMin,
      precipitationProbability,
    } = await getDailyWeatherByLatLon(province.latitude, province.longitude);

    const users = getUserByProvinceId(province.id);
    const usersByLang = users.reduce((acc, user) => {
      acc[user.lang] = acc[user.lang] || [];
      acc[user.lang].push(user.lineUserId);
      return acc;
    }, {});

    for (const lang in usersByLang) {
      const lineUserIds = usersByLang[lang];
      const weatherDescription = weatherCodeDescr[lang][weatherCode];
      const message = MESSAGE_LANG[lang].WEATHER_REPORT.replace(
        "{weatherDescription}",
        weatherDescription
      )
        .replace("{maxTemp}", temperature2mMax)
        .replace("{minTemp}", temperature2mMin)
        .replace("{preciptationProbability}", precipitationProbability);

      sendMulticast(lineUserIds, message);
    }
  }
}

cron.schedule("30 8 * * *", dailyReport, { timezone: "Asia/Bangkok" });
