const http = require('http');
const config = require('./config');
const scraper = require('./scraper');
const notifier = require('./telegramNotifier');
const stateManager = require('./stateManager');

const bot = notifier.inicializarBot(config.telegramToken);

async function verificarDisponibilidad() {
    console.log('🔍 Verificando disponibilidad de entradas...');
    try {
        const estadoInicial = await stateManager.cargarEstado();
        const esPrimeraEjecucion = estadoInicial.sectoresNotificados.length === 0;

        const bootstrapData = await scraper.obtenerDatos(config.url);
        const estadoActual = { ...estadoInicial }; // Create a mutable copy

        const shows = bootstrapData.model.data.shows;
        let todosSectoresDisponibles = []; // All sectors currently available, regardless of config.sectoresObjetivo
        let nuevosSectoresParaNotificar = []; // Only new ones for Telegram, filtered by config.sectoresObjetivo

        for (const show of shows) {
            show.sectors.forEach(grupo => {
                if (grupo.sections && grupo.sections.length > 0) {
                    grupo.sections.forEach(subSector => {
                        if (subSector.available) {
                            todosSectoresDisponibles.push(subSector.name);
                            // Only add to state and new notifications if it's one of the target sectors
                            if (config.sectoresObjetivo.includes(subSector.name) && !estadoActual.sectoresNotificados.includes(subSector.name)) {
                                nuevosSectoresParaNotificar.push(subSector.name);
                                estadoActual.sectoresNotificados.push(subSector.name); // Add to state for future runs
                            }
                        }
                    });
                }
            });
        }

        if (esPrimeraEjecucion) {
            if (todosSectoresDisponibles.length > 0) {
                console.log('🎉 Primera ejecución: Sectores disponibles actualmente (todos):');
                todosSectoresDisponibles.forEach(sector => console.log(`- ${sector}`));
                console.log(`Puedes comprar entradas aquí: ${config.linkCompra}`);
            } else {
                console.log('Primera ejecución: No hay sectores disponibles actualmente.');
            }
            await stateManager.guardarEstado(estadoActual); // Save the state after first run
        } else if (nuevosSectoresParaNotificar.length > 0) {
            const mensaje = `*¡Nuevos sectores disponibles para DUA LIPA!*\n\n*Sectores:* ${nuevosSectoresParaNotificar.join(', ')}\n\n[Comprar entradas aquí](${config.linkCompra})`;
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
