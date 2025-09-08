module.exports = {
  apps: [{
    name: 'question-tool-api',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      DB_PATH: './server/database/questions.db',
      CORS_ORIGIN: 'http://localhost:4200,http://localhost:3000'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      DB_PATH: './server/database/questions.db',
      CORS_ORIGIN: 'https://your-domain.com,http://localhost:3000'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
