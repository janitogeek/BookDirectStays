#!/bin/bash

# BookDirectStays PocketBase Docker Deployment Script
# This script helps deploy PocketBase with Docker for production use

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p pb_data pb_migrations pb_hooks backups ssl
    
    # Set proper permissions
    chmod 755 pb_data pb_migrations pb_hooks backups
    
    print_status "Directories created successfully"
}

# Setup environment file
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp docker.env.example .env
        
        print_warning "Please edit .env file with your actual configuration:"
        print_warning "- Set ADMIN_EMAIL and ADMIN_PASSWORD"
        print_warning "- Set your DOMAIN name"
        print_warning "- Set SSL_EMAIL for Let's Encrypt"
        
        read -p "Press Enter to continue after editing .env file..."
    fi
}

# Generate SSL certificates (Let's Encrypt)
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Check if SSL certificates exist
    if [ ! -f ssl/fullchain.pem ] || [ ! -f ssl/privkey.pem ]; then
        print_warning "SSL certificates not found. You have two options:"
        echo "1. Use Let's Encrypt (recommended for production)"
        echo "2. Use self-signed certificates (for development)"
        
        read -p "Choose option (1 or 2): " choice
        
        if [ "$choice" = "1" ]; then
            # Use Certbot for Let's Encrypt
            print_status "Using Let's Encrypt for SSL..."
            
            # Source environment variables
            source .env
            
            docker run --rm \
                -v ./ssl:/etc/letsencrypt \
                -v ./ssl:/var/lib/letsencrypt \
                -p 80:80 \
                certbot/certbot certonly \
                --standalone \
                --email $SSL_EMAIL \
                --agree-tos \
                --no-eff-email \
                -d $DOMAIN
                
            # Copy certificates to nginx location
            cp ssl/live/$DOMAIN/fullchain.pem ssl/
            cp ssl/live/$DOMAIN/privkey.pem ssl/
            
        else
            # Generate self-signed certificates
            print_status "Generating self-signed certificates..."
            
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ssl/privkey.pem \
                -out ssl/fullchain.pem \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        fi
    fi
}

# Deploy the application
deploy() {
    print_status "Deploying PocketBase with Docker..."
    
    # Build and start containers
    docker-compose up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if PocketBase is running
    if docker-compose ps | grep -q "pocketbase.*Up"; then
        print_status "PocketBase is running successfully!"
        
        # Display access information
        source .env
        echo ""
        echo "=== ACCESS INFORMATION ==="
        echo "PocketBase Admin: https://$DOMAIN/_/"
        echo "PocketBase API: https://$DOMAIN/api/"
        echo "Admin Email: $ADMIN_EMAIL"
        echo "Admin Password: $ADMIN_PASSWORD"
        echo ""
        echo "=== IMPORTANT NOTES ==="
        echo "1. Change the admin password after first login"
        echo "2. Data is persisted in ./pb_data directory"
        echo "3. Backups are stored in ./backups directory"
        echo "4. Logs: docker-compose logs -f pocketbase"
        echo ""
        
    else
        print_error "PocketBase failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Backup function
backup() {
    print_status "Creating backup..."
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backups/backup_$timestamp.tar.gz"
    
    tar -czf $backup_file pb_data/
    
    print_status "Backup created: $backup_file"
}

# Restore function
restore() {
    if [ -z "$1" ]; then
        print_error "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will stop PocketBase and restore from backup. Continue? (y/N)"
    read -p "" confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        # Stop PocketBase
        docker-compose stop pocketbase
        
        # Backup current data
        mv pb_data pb_data.backup.$(date +%Y%m%d_%H%M%S)
        
        # Restore from backup
        tar -xzf $backup_file
        
        # Start PocketBase
        docker-compose start pocketbase
        
        print_status "Restore completed successfully"
    else
        print_status "Restore cancelled"
    fi
}

# Main script
main() {
    case "$1" in
        "deploy")
            check_docker
            create_directories
            setup_env
            setup_ssl
            deploy
            ;;
        "backup")
            backup
            ;;
        "restore")
            restore $2
            ;;
        "logs")
            docker-compose logs -f pocketbase
            ;;
        "stop")
            docker-compose stop
            ;;
        "start")
            docker-compose start
            ;;
        "restart")
            docker-compose restart
            ;;
        "status")
            docker-compose ps
            ;;
        *)
            echo "Usage: $0 {deploy|backup|restore|logs|stop|start|restart|status}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy PocketBase with Docker"
            echo "  backup   - Create a backup of PocketBase data"
            echo "  restore  - Restore from a backup file"
            echo "  logs     - Show PocketBase logs"
            echo "  stop     - Stop all services"
            echo "  start    - Start all services"
            echo "  restart  - Restart all services"
            echo "  status   - Show service status"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 