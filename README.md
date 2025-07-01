# 🤖 Bot de Scraping - Dua Lipa All Access

Bot automatizado para monitorear la disponibilidad de entradas de Dua Lipa en All Access y enviar notificaciones a Telegram.

## 🚀 Inicio Rápido

### Opción 1: Inicio Automático (Recomendado)
```bash
npm start
```

### Opción 2: Inicio Manual
```bash
npm run start-basic
```

### Opción 3: Ejecutar directamente
```bash
npm run bot
```

## 📋 Scripts Disponibles

### Inicio y Gestión
- `npm start` - Inicia el bot con configuración PM2 completa
- `npm run start-basic` - Inicia el bot con configuración básica
- `npm run bot` - Ejecuta el bot directamente sin PM2

### Comandos PM2
- `npm run pm2-start` - Inicia el bot con PM2
- `npm run pm2-stop` - Detiene el bot
- `npm run pm2-restart` - Reinicia el bot
- `npm run pm2-logs` - Muestra los logs del bot
- `npm run pm2-status` - Muestra el estado del bot
- `npm run pm2-monit` - Abre el monitor en tiempo real
- `npm run pm2-delete` - Elimina el bot de PM2
- `npm run pm2-save` - Guarda la configuración actual
- `npm run pm2-startup` - Configura inicio automático del sistema

## 🔧 Configuración

### Variables Importantes en `index.js`:
- `telegramToken` - Token de tu bot de Telegram
- `telegramChatId` - ID del chat/canal donde enviar mensajes
- `cookieHeader` - Cookies de sesión de All Access
- `SECTORES_OBJETIVO` - Sectores que quieres monitorear

### Horarios de Notificación:
El bot envía mensajes de funcionamiento a las:
- 00:00 (Medianoche)
- 06:00 (6 AM)
- 12:00 (Mediodía)
- 18:00 (6 PM)

## 📁 Estructura de Archivos

```
├── index.js              # Bot principal
├── start.js              # Script de inicio básico
├── start-simple.js       # Script de inicio con configuración PM2
├── ecosystem.config.js   # Configuración PM2
├── package.json          # Dependencias y scripts
├── README.md            # Este archivo
└── logs/                # Directorio de logs (se crea automáticamente)
    ├── err.log          # Logs de errores
    ├── out.log          # Logs de salida
    └── combined.log     # Logs combinados
```

## 🔍 Monitoreo

### Ver Logs en Tiempo Real:
```bash
npm run pm2-logs
```

### Monitor Interactivo:
```bash
npm run pm2-monit
```

### Estado del Bot:
```bash
npm run pm2-status
```

## 🛠️ Solución de Problemas

### Si el bot no inicia:
1. Verifica que PM2 esté instalado: `npm install -g pm2`
2. Revisa los logs: `npm run pm2-logs`
3. Reinicia el bot: `npm run pm2-restart`

### Si no recibe notificaciones:
1. Verifica el token de Telegram en `index.js`
2. Confirma el ID del chat/canal
3. Asegúrate de que el bot esté agregado al chat

### Si el scraping falla:
1. Actualiza las cookies en `index.js`
2. Verifica la conexión a internet
3. Revisa si la estructura de la página cambió

## 🔄 Reinicio Automático

El bot está configurado para:
- Reiniciarse automáticamente si falla
- Reiniciarse si usa más de 1GB de memoria
- Mantener logs detallados con timestamps
- Ignorar cambios en `node_modules`

## 📊 Características

- ✅ Monitoreo continuo cada 30 minutos
- ✅ Notificaciones automáticas a Telegram
- ✅ Reinicio automático en caso de fallo
- ✅ Logs detallados y organizados
- ✅ Configuración PM2 profesional
- ✅ Scripts de gestión fáciles de usar
- ✅ Mensajes de estado programados

## 🚨 Notas Importantes

1. **Mantén las cookies actualizadas** - Las cookies de sesión pueden expirar
2. **Verifica el token de Telegram** - Asegúrate de que sea válido
3. **Monitorea los logs** - Revisa regularmente si hay errores
4. **Configura inicio automático** - Usa `npm run pm2-startup` para que el bot inicie con el sistema

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs con `npm run pm2-logs`
2. Verifica la configuración en `index.js`
3. Asegúrate de que todas las dependencias estén instaladas 