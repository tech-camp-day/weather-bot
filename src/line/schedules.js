const cron = require('node-cron');

const { sendMulticast } = require('./messageSender');
const { getDailyWeatherByLatLon } = require('../weather/openmeteo');
const weatherCodeDescr = require('../weather/weatherCode');

const {
  getProvincesThatHasUser,
  getUserByProvinceId
} = require('../data/db');

function alertBadWeather() {
  const provinces = getProvincesThatHasUser();

  for (const province of provinces) {
    // get next hour forecast from API
    // if bad weather, send alert to all users in that province
  }
}

// Schedule the function to run every hour
cron.schedule('0 * * * *', alertBadWeather);

async function dailyReport() {
  const provinces = getProvincesThatHasUser();

  for await (const province of provinces) {
    // get today's forecast from API and send to all users in that province
    const {
      weatherCode,
      temperature2mMax,
      temperature2mMin,
      precipitationProbability,
    } = await getDailyWeatherByLatLon(province.latitude, province.longitude);

    const { lineUserId } = getUserByProvinceId(province.id);

    sendMulticast(lineUserId, 'รายงานสภาพอากาศประจำวัน', `สภาพอากาศวันนี้: ${weatherCodeDescr[weatherCode]}
    อุณหภูมิสูงสุด: ${Math.round(temperature2mMax)}°C
    อุณหภูมิต่ำสุด: ${Math.round(temperature2mMin)}°C
    โอกาสฝนตก: ${Math.round(precipitationProbability)}%`)
  }
}

cron.schedule('0 8 * * *', dailyReport);
