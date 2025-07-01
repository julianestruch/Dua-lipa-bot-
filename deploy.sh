#!/bin/bash

echo "🚀 Desplegando bot de Dua Lipa..."

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear directorio para el bot
mkdir -p ~/dua-lipa-bot
cd ~/dua-lipa-bot

# Clonar o copiar archivos del proyecto
# (Aquí deberías copiar tus archivos del proyecto)

# Instalar dependencias
npm install

# Crear directorio de logs
mkdir -p logs

# Iniciar con PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save

echo "✅ Bot desplegado correctamente!"
echo "📋 Comandos útiles:"
echo "  pm2 status          - Ver estado"
echo "  pm2 logs dua-lipa-bot - Ver logs"
echo "  pm2 restart dua-lipa-bot - Reiniciar"
echo "  pm2 stop dua-lipa-bot - Detener" 