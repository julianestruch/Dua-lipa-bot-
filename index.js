const http = require('http');
const config = require('./config');
const scraper = require('./scraper');
const notifier = require('./telegramNotifier');
const { escapeMarkdown } = require('./telegramNotifier');
const stateManager = require('./stateManager');

const bot = notifier.inicializarBot(config.telegramToken);

async function verificarDisponibilidad() {
    console.log('🔍 Verificando disponibilidad de entradas...');
    try {
        const bootstrapData = await scraper.obtenerDatos(config.url);
        const estadoActual = await stateManager.cargarEstado();
        
        const shows = bootstrapData.model.data.shows;
        let nuevosSectoresDisponibles = [];

        for (const show of shows) {
            show.sectors.forEach(grupo => {
                if (grupo.sections && grupo.sections.length > 0) {
                    grupo.sections.forEach(subSector => {
                        if (config.sectoresObjetivo.includes(subSector.name) && subSector.available) {
                            if (!estadoActual.sectoresNotificados.includes(subSector.name)) {
                                nuevosSectoresDisponibles.push(subSector.name);
                                estadoActual.sectoresNotificados.push(subSector.name);
                            }
                        }
                    });
                }
            });
        }

        if (nuevosSectoresDisponibles.length > 0) {
            const mensaje = `*¡Nuevos sectores disponibles para DUA LIPA!

*Sectores:* ${nuevosSectoresDisponibles.map(s => escapeMarkdown(s)).join(', ')}

[Comprar entradas aquí](${escapeMarkdown(config.linkCompra)})`;
            await notifier.enviarNotificacion(bot, config.telegramChatId, mensaje);
            await stateManager.guardarEstado(estadoActual);
        } else {
            console.log('No hay nuevos sectores disponibles.');
        }

    } catch (error) {
        console.error('Error en el proceso de verificación:', error.message);
        // Opcional: enviar notificación de error a Telegram
        // await notifier.enviarMensajeSimple(bot, config.telegramChatId, '❌ Error en el bot. Revisa los logs.');
    }
}

// --- Servidor HTTP para mantener el bot vivo en Render/Railway ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot de Dua Lipa funcionando correctamente! 🎵');
});

server.listen(config.port, () => {
    console.log(`🌐 Servidor HTTP iniciado en puerto ${config.port}`);
    console.log('🚀 Iniciando bot de scraping...');
    
    // Ejecución inicial y luego a intervalos
    verificarDisponibilidad();
    setInterval(verificarDisponibilidad, config.intervaloMinutos * 60 * 1000);
});

// --- Manejo de señales de terminación ---
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