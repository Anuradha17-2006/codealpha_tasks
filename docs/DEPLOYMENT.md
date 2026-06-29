# ConnectSphere Deployment Guide

## Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/yourusername/connectsphere.git
cd connectsphere

# Configure environment
cp server/.env.example server/.env
nano server/.env

# Deploy
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Server with 2GB+ RAM
- Domain name
- SSL certificate

### Steps

1. **Server Setup**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **Clone & Configure**
   ```bash
   git clone https://github.com/yourusername/connectsphere.git /opt/connectsphere
   cd /opt/connectsphere
   cp server/.env.example server/.env
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   DB_PASSWORD=strong_password
   JWT_SECRET=generate_strong_secret
   JWT_REFRESH_SECRET=another_strong_secret
   FRONTEND_URL=https://yourdomain.com
   ```

4. **Deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **SSL with Let's Encrypt**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   # Update nginx.conf with SSL paths
   ```

### Monitoring & Backups

```bash
# View logs
docker-compose logs -f backend

# Database backup
docker-compose exec db mysqldump -u connectsphere -pconnectsphere connectsphere > backup.sql

# Monitor health
curl http://localhost:5000/health
```

### Maintenance

```bash
# Update containers
docker-compose pull
docker-compose up -d

# Clean up
docker system prune -a

# View stats
docker stats
```

---

See README.md for more details.
