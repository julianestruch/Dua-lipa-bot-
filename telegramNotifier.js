const TelegramBot = require('node-telegram-bot-api');

function inicializarBot(token) {
  return new TelegramBot(token);
}

async function enviarNotificacion(bot, chatId, mensaje) {
  try {
    await bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown', disable_web_page_preview: false });
    console.log("✅ Notificación enviada a Telegram con éxito!");
  } catch (error) {
    console.error('❌ Error al enviar notificación a Telegram:', error.message);
  }
}

async function enviarMensajeSimple(bot, chatId, mensaje) {
    try {
        await bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' });
        console.log(`✅ Mensaje de estado enviado: ${mensaje}`);
    } catch (error) {
        console.error('❌ Error al enviar mensaje simple a Telegram:', error.message);
    }
}

module.exports = { inicializarBot, enviarNotificacion, enviarMensajeSimple };
