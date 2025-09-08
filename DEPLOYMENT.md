# 🚀 Deployment Guide

This guide covers different deployment options for the Question Tool application.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A web server (for production builds)

## 🏠 Self-Hosting Options

### Option 1: Traditional VPS/Server

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd question-tool
   ```

2. **Install dependencies:**
   ```bash
   npm run install-all
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Configure web server:**
   - Serve the `client/dist/question-tool/` directory as static files
   - Configure API proxy to `http://localhost:3000` for `/api/*` routes

5. **Start the backend:**
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY client/package*.json ./client/
RUN cd client && npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend
COPY --from=builder /app/client/dist/question-tool ./public

# Copy backend
COPY server/ ./server/

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t question-tool .
docker run -p 3000:3000 question-tool
```

### Option 3: PM2 Process Manager

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file (`ecosystem.config.js`):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'question-tool-api',
       script: 'server/index.js',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

3. **Start with PM2:**
   ```bash
   npm run build
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🌐 Web Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Serve Angular app
    location / {
        root /path/to/client/dist/question-tool;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/client/dist/question-tool
    
    # Serve Angular app
    <Directory "/path/to/client/dist/question-tool">
        AllowOverride All
        Require all granted
    </Directory>
    
    # Proxy API requests
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</VirtualHost>
```

## 🔧 Environment Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_PATH=./server/database/questions.db

# CORS Configuration
CORS_ORIGIN=http://localhost:4200,https://your-domain.com

# Optional: API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring & Logging

### Health Check Endpoint

The API includes a health check at `GET /api/health`:

```bash
curl http://localhost:3000/api/health
```

### Logging

Logs are written to console. For production, consider:

1. **File logging:**
   ```bash
   npm start > logs/app.log 2>&1
   ```

2. **PM2 logging:**
   ```bash
   pm2 logs question-tool-api
   ```

## 🔒 Security Considerations

1. **HTTPS:** Always use HTTPS in production
2. **CORS:** Configure CORS origins properly
3. **Rate Limiting:** Implement API rate limiting
4. **Database:** Secure your SQLite database file
5. **Environment Variables:** Never commit sensitive data

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Build fails:**
   ```bash
   rm -rf node_modules client/node_modules
   npm run install-all
   ```

3. **Database issues:**
   ```bash
   rm server/database/questions.db
   npm start  # Database will be recreated
   ```

### Performance Optimization

1. **Enable gzip compression**
2. **Set proper cache headers**
3. **Use CDN for static assets**
4. **Monitor memory usage**

## 📈 Scaling

For high-traffic deployments:

1. **Load Balancing:** Use multiple backend instances
2. **Database:** Consider migrating to PostgreSQL/MySQL
3. **Caching:** Implement Redis for session storage
4. **CDN:** Use CloudFlare or similar for static assets

## 🆘 Support

If you encounter issues:

1. Check the logs: `pm2 logs` or `npm start`
2. Verify all dependencies are installed
3. Ensure Node.js version is 18+
4. Check firewall and port configurations
