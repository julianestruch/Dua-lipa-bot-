# 🤖 Bot de Scraping - Dua Lipa All Access

Bot automatizado para monitorear la disponibilidad de entradas de Dua Lipa en All Access y enviar notificaciones a Telegram.

## ✨ Características

- **Monitoreo Continuo:** Revisa la disponibilidad de entradas a intervalos configurables.
- **Notificaciones Inteligentes:** Envía alertas a Telegram solo cuando un sector de interés pasa de *agotado* a *disponible*, evitando spam.
- **Configuración Segura:** Utiliza un archivo `.env` para gestionar las credenciales y parámetros, manteniendo la seguridad.
- **Robusto y Modular:** Código organizado en módulos para facilitar el mantenimiento y la escalabilidad.
- **Listo para Despliegue:** Preparado para funcionar en plataformas como Render o Railway.

## 🚀 Inicio Rápido

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/julianestruch/Dua-lipa-bot-.git
    cd Dua-lipa-bot-
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    - Renombra el archivo `.env.example` a `.env`.
    - Abre el archivo `.env` y completa los valores (token de Telegram, ID del chat, etc.).

4.  **Iniciar el bot:**
    ```bash
    npm start
    ```

## 🔧 Configuración (`.env`)

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# URL de la página a monitorear
SCRAPE_URL=https://www.allaccess.com.ar/event/dua-lipa

# Credenciales de Telegram
TELEGRAM_TOKEN="aqui_tu_token"
TELEGRAM_CHAT_ID="aqui_tu_chat_id"

# Configuración del scraping (intervalo en minutos)
INTERVALO_MINUTOS=30

# Sectores a monitorear (separados por comas, sin espacios)
SECTORES_OBJETIVO=106,105,104,103,112,113,114.1,114.2

# Puerto para el servidor web (necesario para Render/Railway)
PORT=3000
```

## 📁 Estructura de Archivos

```
.env                # Archivo de configuración (local, no versionado)
.env.example        # Plantilla de configuración
config.js           # Carga y exporta la configuración
scraper.js          # Lógica para obtener datos de la web
telegramNotifier.js # Maneja las notificaciones de Telegram
stateManager.js     # Gestiona el estado para evitar notificaciones repetidas
index.js            # Punto de entrada principal de la aplicación
package.json        # Dependencias y scripts
README.md           # Este archivo
```

## 🛠️ Scripts Disponibles

- `npm start`: Inicia el bot.