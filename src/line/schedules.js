const cron = require('node-cron');

const { send } = require('./messageSender');

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

function dailyReport() {
  const provinces = getProvincesThatHasUser();

  for (const province of provinces) {
    // get today's forecast from API and send to all users in that province
  }
}

cron.schedule('0 8 * * *', dailyReport);
