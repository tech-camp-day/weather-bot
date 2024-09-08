const MESSAGE_LANG = {
  th: {
    HELLO: "สวัสดีครับ ผมคือ Weather Bot คุณสามารถเลือกจังหวัดที่ต้องการรับข้อมูลอากาศได้เลย",
    ASK_PROVINCE: "คุณพี่อยู่จังหวัดอะไรคะ?",
    SORRY: "ไม่เข้าใจข้อความที่คุณส่งมา",
    UPDATE_COMPLETE: "เปลี่ยนจังหวัดเรียบร้อย เราจะส่งข้อมูลอากาศให้คุณทุกวัน",
    SELECT_COMPLETE: "เลือกจังหวัดเรียบร้อย เราจะส่งข้อมูลอากาศให้คุณทุกวัน",
    NO_PROVINCE: "ขอโทษครับ ไม่พบจังหวัดที่คุณต้องการ",
    WEATHER_ALERT: `!!! เตือนภัยอากาศ !!! 
{weatherDescription}ในอีก 1 ชั่วโมงข้างหน้า, โอกาสฝนตก {preciptationProbability}%`,
    WEATHER_REPORT: `สภาพอากาศวันนี้: {weatherDescription}
อุณหภูมิสูงสุด: {maxTemp}°C
อุณหภูมิต่ำสุด: {minTemp}°C
โอกาสฝนตก: {preciptationProbability}%`,
  },
  en: {
    HELLO: "Hello, I'm Weather Bot. You can select your province to receive weather information.",
    ASK_PROVINCE: "Which province are you in?",
    SORRY: "Sorry, I don't understand your message.",
    UPDATE_COMPLETE: "Changed province successfully. I will send you weather information every day.",
    SELECT_COMPLETE: "Selected province successfully. I will send you weather information every day.",
    NO_PROVINCE: "Sorry, I can't find the province you want.",
    WEATHER_ALERT: `!!! Weather Alert !!!
{weatherDescription} in the next 1 hour, precipitation probability is {preciptationProbability}%`,
    WEATHER_REPORT: `Today's weather: {weatherDescription}
Maximum temperature: {maxTemp}°C
Minimum temperature: {minTemp}°C
Precipitation probability: {preciptationProbability}%`,
  }
}

module.exports = MESSAGE_LANG;
