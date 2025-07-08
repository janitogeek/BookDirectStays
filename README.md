# BookDirectStays.com

A global directory platform for direct booking accommodations, built with React, Vite, Tailwind CSS, and PocketBase.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose (for backend)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookDirectStays
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the backend (PocketBase with Docker)**
   ```bash
   cd ..
   ./deploy.sh deploy
   ```

4. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - PocketBase Admin: `http://localhost:8080/_/`
   - API: `http://localhost:8080/api/`

## 🐳 Docker Deployment

For production deployment, we use Docker for PocketBase to ensure data persistence and scalability.

### Why Docker?

- **Persistent Data**: Your data survives container restarts
- **Easy Scaling**: Scale up/down as needed
- **Cost Effective**: Deploy on any VPS for $5-20/month
- **SSL Support**: Production-ready with Let's Encrypt
- **Automated Backups**: Built-in backup system

### Production Deployment

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete deployment instructions.

**Quick production deployment:**
```bash
# Configure environment
cp docker.env.example .env
# Edit .env with your domain and credentials

# Deploy
./deploy.sh deploy
```

## 🏗️ Project Structure

```
BookDirectStays/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and services
│   │   └── hooks/         # Custom React hooks
│   └── package.json
├── pb_data/               # PocketBase data (persistent)
├── pb_migrations/         # Database migrations
├── docker-compose.yml     # Docker configuration
├── Dockerfile.pocketbase  # PocketBase Docker image
├── nginx.conf            # Nginx configuration
├── deploy.sh             # Deployment script
└── README.md
```

## 📋 Features

- **Property Directory**: Browse accommodations by country
- **Submission System**: Property owners can submit listings
- **Admin CMS**: Manage submissions, listings, and content
- **Responsive Design**: Works on desktop and mobile
- **Search & Filter**: Find properties by location and type
- **Direct Booking**: Links to property websites
- **SEO Optimized**: Fast loading and search engine friendly

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Radix UI** for components

### Backend
- **PocketBase** - Backend as a Service
- **SQLite** - Database
- **Docker** - Containerization
- **Nginx** - Reverse proxy and SSL

## 🔧 Development

### Backend Development

Start PocketBase with Docker:
```bash
docker-compose up -d pocketbase
```

Access PocketBase Admin at `http://localhost:8080/_/`

### Frontend Development

```bash
cd client
npm run dev
```

### Database Schema

The application uses these main collections:
- `submissions` - Property submissions from owners
- `listings` - Approved property listings
- `countries` - Country data with listing counts
- `subscriptions` - Newsletter subscriptions
- `faqs` - Frequently asked questions
- `testimonials` - User testimonials

## 🚀 Deployment Options

### 1. DigitalOcean Droplet (Recommended)
- $10/month for stable hosting
- Pre-configured Docker environment
- Easy SSL setup with Let's Encrypt

### 2. AWS EC2
- Free tier eligible (t3.micro)
- Scalable infrastructure
- Full control over resources

### 3. Google Cloud Platform
- $300 free credit for new users
- Global infrastructure
- Easy scaling options

### 4. Local Development
- Use Docker Compose for local backend
- No SSL required for development

## 📊 Admin CMS

Access the built-in CMS at `/admin/cms` to manage:
- **Submissions**: Review and approve property submissions
- **Listings**: Manage approved properties
- **Countries**: Add and edit country data
- **Subscriptions**: View newsletter subscribers
- **FAQs**: Manage frequently asked questions
- **Testimonials**: Add and edit testimonials

## 🔐 Security

- Rate limiting on API endpoints
- CORS configuration
- SSL/TLS encryption in production
- Input validation and sanitization
- Secure file uploads

## 📈 Monitoring

Monitor your deployment with:
```bash
# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Create backup
./deploy.sh backup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For deployment issues, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

For general questions, check the FAQ or open an issue. 