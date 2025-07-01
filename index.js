// Importamos las librerías necesarias
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// --- CONFIGURACIÓN ---

// URL del evento que queremos monitorear
const url = 'https://www.allaccess.com.ar/event/dua-lipa';

// Token de API desde variables de entorno o valor por defecto
const telegramToken = process.env.TELEGRAM_TOKEN || '8045429192:AAEVgIT5e6YlzqtAQc5Si8AyEyhwcOHi5pI'; 

// ID de chat desde variables de entorno o valor por defecto
const telegramChatId = process.env.TELEGRAM_CHAT_ID || '-1002855050583'; 

// Sin cookies - haciendo peticiones directas

// Inicializamos el bot. No necesitamos 'polling' porque solo vamos a enviar mensajes.
const bot = new TelegramBot(telegramToken);

const INTERVALO_MINUTOS = 30; // Intervalo de media hora
const LINK_COMPRA = 'https://www.allaccess.com.ar/event/dua-lipa';
const SECTORES_OBJETIVO = ['106', '105', '104', '103', '112', '113', '114.1', '114.2'];

// ================== Servidor HTTP para Railway ==================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot de Dua Lipa funcionando correctamente! 🎵');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP iniciado en puerto ${PORT}`);
  console.log(`📡 El bot está listo para recibir peticiones HTTP`);
});
// ===============================================================

/**
 * Función para mostrar todos los asientos disponibles en consola (solo al inicio)
 */
async function mostrarTodosLosAsientos() {
  try {
    console.log('🔍 Obteniendo información completa de asientos...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const htmlContent = response.data;
    const bootstrapLine = htmlContent.split('\n').find(line => line.trim().startsWith('App.bootstrapData'));

    if (!bootstrapLine) {
      throw new Error("No se pudo encontrar 'App.bootstrapData'. La estructura de la página pudo haber cambiado.");
    }

    const jsonString = bootstrapLine.substring(bootstrapLine.indexOf('(') + 1, bootstrapLine.lastIndexOf(')'));
    const bootstrapData = JSON.parse(jsonString);
    
    console.log("📊 ANALIZANDO TODOS LOS ASIENTOS DISPONIBLES:");
    console.log("=" .repeat(80));
    
    const shows = bootstrapData.model.data.shows;

    for (const show of shows) {
      console.log(`\n🎭 FUNCIÓN: ${show.name}`);
      console.log("-".repeat(50));
      
      show.sectors.forEach(grupo => {
        console.log(`\n📍 GRUPO: ${grupo.name}`);
        if (grupo.sections && grupo.sections.length > 0) {
          grupo.sections.forEach(subSector => {
            const estado = subSector.available ? '✅ DISPONIBLE' : '❌ AGOTADO';
            const esObjetivo = SECTORES_OBJETIVO.includes(subSector.name) ? '🎯 OBJETIVO' : '';
            console.log(`  ${subSector.name.padEnd(10)} | ${estado.padEnd(15)} | ${esObjetivo}`);
          });
        }
      });
    }
    
    console.log("\n" + "=".repeat(80));
    console.log("✅ Análisis completo mostrado en consola");
    
  } catch (error) {
    console.error('❌ Error al obtener información completa:', error.message);
  }
}

/**
 * Función principal que realiza el scraping y notifica a Telegram
 */
async function scrapeYNotificar() {
  try {
    console.log('Obteniendo datos de All Access...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const htmlContent = response.data;
    const bootstrapLine = htmlContent.split('\n').find(line => line.trim().startsWith('App.bootstrapData'));

    if (!bootstrapLine) {
      throw new Error("No se pudo encontrar 'App.bootstrapData'. La estructura de la página pudo haber cambiado.");
    }

    const jsonString = bootstrapLine.substring(bootstrapLine.indexOf('(') + 1, bootstrapLine.lastIndexOf(')'));
    const bootstrapData = JSON.parse(jsonString);
    
    console.log("Analizando disponibilidad...");
    const shows = bootstrapData.model.data.shows;

    // Verificamos si al menos uno de los sectores objetivo está disponible en todas las fechas
    let algunSectorDisponibleEnTodas = false;
    let detallesPorShow = [];
    let sectoresDisponiblesPorShow = [];

    for (const show of shows) {
      let sectoresDisponibles = [];
      let subSectoresInfo = [];

      show.sectors.forEach(grupo => {
        if (grupo.sections && grupo.sections.length > 0) {
          grupo.sections.forEach(subSector => {
            if (SECTORES_OBJETIVO.includes(subSector.name) && subSector.available) {
              sectoresDisponibles.push(subSector.name);
            }
            subSectoresInfo.push({
              'SubSector': subSector.name,
              'Estado': subSector.available ? '✅ DISPONIBLE' : '❌ AGOTADO',
              'Grupo': grupo.name,
            });
          });
        }
      });
      sectoresDisponiblesPorShow.push(sectoresDisponibles);
      detallesPorShow.push({ show, subSectoresInfo });
    }

    // Intersección de sectores disponibles en todas las fechas
    let sectoresDisponiblesEnTodas = SECTORES_OBJETIVO.filter(sector => sectoresDisponiblesPorShow.every(lista => lista.includes(sector)));
    if (sectoresDisponiblesEnTodas.length > 0) {
      algunSectorDisponibleEnTodas = true;
    }

    if (algunSectorDisponibleEnTodas) {
      for (const { show, subSectoresInfo } of detallesPorShow) {
        let mensaje = `*¡ATENCIÓN! Sectores disponibles para DUA LIPA - ${show.name}*\n\n`;
        mensaje += `[Comprar entradas aquí](${LINK_COMPRA})\n\n`;
        mensaje += `*Sectores objetivo disponibles en todas las fechas:*\n`;
        mensaje += sectoresDisponiblesEnTodas.join(', ') + '\n\n';
        mensaje += "*Estado Detallado de Sub-Sectores:*\n";
        mensaje += "```\n";
        subSectoresInfo.sort((a, b) => a.SubSector.localeCompare(b.SubSector, undefined, { numeric: true }));
        subSectoresInfo.forEach(s => {
          const sector = s.SubSector.padEnd(12, ' ');
          const estado = s.Estado.padEnd(15, ' ');
          mensaje += `${sector}| ${estado}| (${s.Grupo})\n`;
        });
        mensaje += "```\n";
        console.log(`Enviando reporte para la función ${show.name}...`);
        await bot.sendMessage(telegramChatId, mensaje, { parse_mode: 'Markdown', disable_web_page_preview: false });
      }
      console.log("¡Reporte enviado a Telegram con éxito!");
    } else {
      console.log("Ninguno de los sectores objetivo está disponible en todas las fechas. No se envía mensaje.");
    }

  } catch (error) {
    console.error('Ocurrió un error general:', error.message);
    try {
      let mensajeError = `*❌ ERROR EN EL BOT* \n\nNo se pudo obtener la información de las entradas.`;
      if (error.response && error.response.status) {
        mensajeError += `\n\n*Código de estado HTTP:* ${error.response.status}`;
      }
      mensajeError += `\n\n*Motivo:* ${error.message}`;
      mensajeError += `\n\n_Por favor, revisar la conexión a internet o si la estructura de la página web cambió._`;
      await bot.sendMessage(telegramChatId, mensajeError, { parse_mode: 'Markdown' });
    } catch (telegramError) {
      console.error('Error Crítico: No se pudo ni siquiera enviar el mensaje de error a Telegram.', telegramError.message);
    }
  }
}

// Ejecutamos la función principal cada media hora
global.intervalScrape = setInterval(scrapeYNotificar, INTERVALO_MINUTOS * 60 * 1000);

// Ejecutamos la función de mostrar todos los asientos solo al inicio
console.log('🚀 Iniciando bot de scraping de Dua Lipa...');
mostrarTodosLosAsientos().then(() => {
  console.log('🔄 Iniciando monitoreo continuo...');
  // Ejecutamos la función principal una vez después del análisis inicial
  scrapeYNotificar();
});

// Enviar mensaje de "estoy funcionando correctamente" cada 6 horas
// Railway está en us-east4-eqdc4a (UTC-4), ajustamos horarios para Argentina (UTC-3)
let horasEnviadas = new Set();
setInterval(async () => {
  const ahora = new Date();
  // Convertir a hora de Argentina (UTC-3)
  const horaArgentina = new Date(ahora.getTime() + (1 * 60 * 60 * 1000)); // +1 hora para Argentina
  const hora = horaArgentina.getHours();
  const minutos = horaArgentina.getMinutes();
  
  // Horarios adaptados para Argentina: 06:00, 12:00, 18:00, 00:00 (hora local)
  // En Railway (UTC-4) esto corresponde a: 05:00, 11:00, 17:00, 23:00
  if ((hora === 6 || hora === 12 || hora === 18 || hora === 0) && minutos === 0 && !horasEnviadas.has(hora)) {
    try {
      const horaFormateada = hora === 0 ? '00' : hora.toString().padStart(2, '0');
      await bot.sendMessage(telegramChatId, `✅ Bot funcionando correctamente - ${horaFormateada}:00 (hora Argentina)`);
      horasEnviadas.add(hora);
      console.log(`Mensaje de funcionamiento enviado a las ${horaFormateada}:00 (hora Argentina).`);
    } catch (e) {
      console.error('No se pudo enviar el mensaje de funcionamiento:', e.message);
    }
  }
  
  // Resetear el set de horas enviadas después de las 23:59 (hora Argentina)
  if (hora === 23 && minutos === 59) {
    horasEnviadas.clear();
    console.log('🔄 Reset de horas enviadas para el nuevo día.');
  }
}, 60 * 1000); // Comprobar cada minuto

// Manejar señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Manejo global de errores para evitar que el proceso termine
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo de promesa no manejado:', reason);
});

// Bucle infinito para mantener el proceso vivo (Railway workaround)
async function keepAlive() {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000)); // 1 hora
  }
}
keepAlive();