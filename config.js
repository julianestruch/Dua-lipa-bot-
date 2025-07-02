require('dotenv').config();

module.exports = {
  url: process.env.SCRAPE_URL || 'https://www.allaccess.com.ar/event/dua-lipa',
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  intervaloMinutos: parseInt(process.env.INTERVALO_MINUTOS, 10) || 30,
  linkCompra: process.env.LINK_COMPRA || 'https://www.allaccess.com.ar/event/dua-lipa',
  sectoresObjetivo: process.env.SECTORES_OBJETIVO ? process.env.SECTORES_OBJETIVO.split(',') : ['106', '105', '104', '103', '112', '113', '114.1', '114.2'],
  port: process.env.PORT || 3000,
};
