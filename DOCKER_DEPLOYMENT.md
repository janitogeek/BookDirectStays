# PocketBase Docker Deployment Guide

This guide will help you deploy PocketBase using Docker for a stable, scalable, and production-ready solution.

## Why Docker for PocketBase?

✅ **Persistent Data** - Your data survives container restarts  
✅ **Easy Scaling** - Scale up/down as needed  
✅ **Consistent Environment** - Works the same everywhere  
✅ **Automated Backups** - Built-in backup system  
✅ **SSL/HTTPS Support** - Production-ready with Let's Encrypt  
✅ **Cost Effective** - Deploy on any VPS for $5-20/month  

## Prerequisites

- Docker and Docker Compose installed
- A domain name (for production with SSL)
- A server/VPS (DigitalOcean, Linode, AWS, etc.)

## Quick Start

1. **Clone and Navigate**
   ```bash
   git clone <your-repo>
   cd BookDirectStays
   ```

2. **Make Deploy Script Executable**
   ```bash
   chmod +x deploy.sh
   ```

3. **Deploy**
   ```bash
   ./deploy.sh deploy
   ```

4. **Follow the prompts to configure your domain and SSL**

## Manual Setup

### 1. Environment Configuration

Copy the environment template:
```bash
cp docker.env.example .env
```

Edit `.env` with your configuration:
```bash
# PocketBase Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password-123!

# Domain Configuration
DOMAIN=api.yourdomain.com
SSL_EMAIL=your-email@yourdomain.com
```

### 2. Deploy with Docker Compose

```bash
# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f pocketbase
```

### 3. Access Your PocketBase

- **Admin Interface**: `https://yourdomain.com/_/`
- **API Endpoint**: `https://yourdomain.com/api/`
- **Health Check**: `https://yourdomain.com/api/health`

## Deployment Options

### Option 1: DigitalOcean Droplet (Recommended)

1. **Create a $10/month droplet** with Docker pre-installed
2. **Point your domain** to the droplet IP
3. **SSH into the droplet** and run the deployment

```bash
# Connect to your droplet
ssh root@your-droplet-ip

# Install Docker (if not pre-installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Deploy PocketBase
git clone <your-repo>
cd BookDirectStays
./deploy.sh deploy
```

### Option 2: AWS EC2

1. **Launch a t3.micro instance** (free tier eligible)
2. **Install Docker**
3. **Configure security group** to allow ports 80, 443, and 22
4. **Deploy as above**

### Option 3: Google Cloud Platform

1. **Create a Compute Engine instance**
2. **Install Docker**
3. **Deploy as above**

### Option 4: Local Development

For local development, you can run without SSL:

```bash
# Use docker-compose override for local development
version: '3.8'
services:
  pocketbase:
    ports:
      - "8080:8080"
  nginx:
    ports:
      - "80:80"
```

## Configuration Options

### Basic Configuration

The `docker-compose.yml` includes:
- **PocketBase server** with persistent data
- **Nginx reverse proxy** with SSL termination
- **Automated backups** with configurable schedule
- **Health monitoring** and auto-restart

### Advanced Configuration

#### Custom Nginx Configuration

Edit `nginx.conf` to customize:
- Rate limiting
- CORS policies
- Security headers
- Custom routes

#### Backup Configuration

Backups run automatically via cron. Configure in `.env`:
```bash
BACKUP_SCHEDULE=0 2 * * *  # Daily at 2 AM
```

Manual backup:
```bash
./deploy.sh backup
```

Restore from backup:
```bash
./deploy.sh restore backups/backup_20241213_020000.tar.gz
```

## Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# PocketBase only
docker-compose logs -f pocketbase

# Nginx only
docker-compose logs -f nginx
```

### Health Checks
```bash
# Check service status
docker-compose ps

# Test API health
curl https://yourdomain.com/api/health
```

### Updates
```bash
# Update PocketBase version
# Edit PB_VERSION in Dockerfile.pocketbase
docker-compose up -d --build pocketbase
```

## Security Best Practices

1. **Change default admin password** immediately
2. **Use strong passwords** and consider 2FA
3. **Regular backups** - automated and manual
4. **Monitor logs** for suspicious activity
5. **Keep Docker images updated**
6. **Use firewall rules** to restrict access

## Troubleshooting

### Common Issues

**PocketBase won't start:**
```bash
# Check logs
docker-compose logs pocketbase

# Check disk space
df -h

# Check permissions
ls -la pb_data/
```

**SSL certificate issues:**
```bash
# Regenerate certificates
rm -rf ssl/*
./deploy.sh deploy
```

**Database corruption:**
```bash
# Restore from backup
./deploy.sh restore backups/backup_latest.tar.gz
```

**Performance issues:**
```bash
# Monitor resource usage
docker stats

# Check database size
du -sh pb_data/
```

### Support Commands

```bash
# Deploy/redeploy
./deploy.sh deploy

# Create backup
./deploy.sh backup

# Restore from backup
./deploy.sh restore <backup-file>

# View logs
./deploy.sh logs

# Stop services
./deploy.sh stop

# Start services
./deploy.sh start

# Restart services
./deploy.sh restart

# Check status
./deploy.sh status
```

## Scaling Considerations

### Vertical Scaling (Single Server)
- Start with 1GB RAM, 1 CPU
- Monitor and upgrade as needed
- PocketBase is very efficient

### Horizontal Scaling (Multiple Servers)
- Use load balancer (nginx, AWS ALB)
- Shared storage for `pb_data`
- Database clustering (future PocketBase feature)

### Performance Optimization
- Use SSD storage
- Enable gzip compression (included in nginx config)
- Configure proper caching headers
- Monitor database performance

## Cost Estimates

### Monthly Costs

| Provider | Instance Type | Cost | Suitable For |
|----------|---------------|------|--------------|
| DigitalOcean | $10 Droplet | $10/month | Small-medium apps |
| AWS EC2 | t3.micro | $8/month | Small apps |
| Google Cloud | e2-micro | $7/month | Small apps |
| Linode | Nanode 1GB | $5/month | Development |

### Additional Costs
- Domain name: $10-15/year
- SSL certificate: Free (Let's Encrypt)
- Backups: $1-5/month (depends on storage)

## Migration from Render

If you're migrating from Render:

1. **Export data** from your Render PocketBase
2. **Set up Docker deployment** as above
3. **Import data** to your new Docker instance
4. **Update client configuration** to use new API URL

## Client Configuration

Update your client to use the new Docker deployment:

```typescript
// client/src/lib/pocketbase.ts
const POCKETBASE_URL = 'https://yourdomain.com'; // Your new Docker URL
```

## Conclusion

Docker provides a much more stable and scalable solution than ephemeral hosting platforms. You'll have:

- **Persistent data** that survives restarts
- **Full control** over your infrastructure
- **Predictable costs** and performance
- **Easy scaling** as your app grows
- **Professional deployment** with SSL and monitoring

This setup will serve you well from development through production scaling! 