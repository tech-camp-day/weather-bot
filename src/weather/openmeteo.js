const { fetchWeatherApi } = require("openmeteo");

async function getDailyWeatherByLatLon(latitude, longitude) {
  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ],
    timezone: "Asia/Bangkok",
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const daily = response.daily();

  const weatherCode = daily.variables(0).valuesArray()[0];
  const temperature2mMax = daily.variables(1).valuesArray()[0];
  const temperature2mMin = daily.variables(2).valuesArray()[0];
  const precipitationProbability = daily.variables(2).valuesArray()[0];

  return {
    weatherCode,
    temperature2mMax,
    temperature2mMin,
    precipitationProbability,
  };
}

module.exports = { getDailyWeatherByLatLon };