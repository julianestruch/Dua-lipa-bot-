module.exports = {
  apps: [{
    name: 'dua-lipa-bot',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ['node_modules', '*.log'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Reiniciar automáticamente si se detecta un problema
    max_restarts: 10,
    min_uptime: '10s',
    // Configuración para evitar reinicios infinitos
    restart_delay: 4000,
    // Variables de entorno específicas del bot
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}; 