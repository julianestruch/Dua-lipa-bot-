# 🚀 Guía de Despliegue - Bot Dua Lipa

## Opciones de Hosting

### 1. **Railway** (Recomendado - Gratis)
**Ventajas:** Fácil, gratis, automático, buena documentación

#### Pasos:
1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Crea un nuevo proyecto
4. Selecciona "Deploy from GitHub repo"
5. Selecciona tu repositorio
6. Railway detectará automáticamente que es un proyecto Node.js
7. El bot se desplegará automáticamente

#### Variables de entorno (si las necesitas):
- `NODE_ENV=production`

---

### 2. **Render** (Alternativa gratuita)
**Ventajas:** Gratis, fácil, buena documentación

#### Pasos:
1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. Crea un nuevo "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

---

### 3. **Heroku** (Opción clásica)
**Ventajas:** Confiable, buena documentación

#### Pasos:
1. Instala Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Crea app: `heroku create dua-lipa-bot`
4. Despliega: `git push heroku main`
5. Inicia worker: `heroku ps:scale worker=1`

---

### 4. **VPS/Droplet** (Control total)
**Ventajas:** Control completo, más barato a largo plazo

#### Opciones:
- **DigitalOcean:** $5/mes
- **Vultr:** $2.50/mes
- **Linode:** $5/mes

#### Pasos:
1. Crea un Droplet/VPS con Ubuntu
2. Conéctate via SSH
3. Ejecuta el script de despliegue:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

---

## 📋 Preparación del Proyecto

### 1. Asegúrate de que tu `package.json` tenga:
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

### 2. Verifica que no tengas archivos sensibles:
- ✅ `index.js` - código principal
- ✅ `package.json` - dependencias
- ✅ `ecosystem.config.js` - configuración PM2
- ❌ No incluir tokens en el código (usar variables de entorno)

### 3. Variables de entorno recomendadas:
```bash
TELEGRAM_TOKEN=tu_token_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui
```

---

## 🔧 Configuración Post-Despliegue

### Railway/Render/Heroku:
- Los logs se pueden ver en el dashboard
- Configuración automática de reinicio

### VPS:
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs dua-lipa-bot

# Reiniciar
pm2 restart dua-lipa-bot

# Detener
pm2 stop dua-lipa-bot
```

---

## 🚨 Consideraciones Importantes

### 1. **Rate Limiting:**
- El bot hace peticiones cada 30 minutos
- Algunos servicios gratuitos tienen límites

### 2. **Uptime:**
- Railway/Render: 99%+ uptime
- Heroku: 99%+ uptime (con dyno)
- VPS: Depende de tu configuración

### 3. **Costos:**
- Railway: Gratis (500 horas/mes)
- Render: Gratis
- Heroku: $7/mes (dyno básico)
- VPS: $2.50-$5/mes

---

## 🎯 Recomendación Final

**Para empezar:** Railway
- Gratis
- Fácil de configurar
- Buena documentación
- Despliegue automático

**Para producción:** VPS
- Más control
- Más barato a largo plazo
- Mejor rendimiento

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servicio
2. Verifica que las dependencias estén instaladas
3. Confirma que el token de Telegram sea válido
4. Revisa que el chat ID sea correcto 