#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to generate random secret
generate_secret() {
    python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null || \
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-50
}

# Print banner
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║              SecurePress Installation                 ║"
echo "║                                                        ║"
echo "║  Modern, Security-First CMS                           ║"
echo "║  Built with React, TypeScript, Django & PostgreSQL    ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check for Docker
print_info "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    print_info "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    print_info "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker."
    exit 1
fi

print_success "Docker daemon is running"

# Generate environment files
print_info "Creating environment files..."

# Backend .env
if [ ! -f "./backend/.env" ]; then
    cat > ./backend/.env << EOF
# Django Settings
DJANGO_SECRET_KEY=$(generate_secret)
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Database
DATABASE_URL=postgresql://securepress:securepress_password_$(generate_secret | cut -c1-16)@db:5432/securepress
POSTGRES_DB=securepress
POSTGRES_USER=securepress
POSTGRES_PASSWORD=securepress_password_$(generate_secret | cut -c1-16)

# JWT Settings
JWT_SECRET_KEY=$(generate_secret)
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Email (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=localhost
EMAIL_PORT=1025
EOF
    print_success "Created backend/.env"
else
    print_warning "backend/.env already exists, skipping..."
fi

# Frontend .env
if [ ! -f "./frontend/.env" ]; then
    cat > ./frontend/.env << EOF
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=SecurePress
VITE_APP_VERSION=1.0.0
EOF
    print_success "Created frontend/.env"
else
    print_warning "frontend/.env already exists, skipping..."
fi

# Root .env for docker-compose
if [ ! -f "./.env" ]; then
    cat > ./.env << EOF
# PostgreSQL Configuration
POSTGRES_DB=securepress
POSTGRES_USER=securepress
POSTGRES_PASSWORD=securepress_password_$(generate_secret | cut -c1-16)
EOF
    print_success "Created root .env"
else
    print_warning ".env already exists, skipping..."
fi

# Build Docker images
print_info "Building Docker images (this may take a few minutes)..."
docker-compose build

# Start services
print_info "Starting services..."
docker-compose up -d db

# Wait for database
print_info "Waiting for database to be ready..."
sleep 10

# Start backend
docker-compose up -d backend

# Wait for backend to be ready
print_info "Waiting for backend to be ready..."
sleep 10

# Run migrations
print_info "Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Collect static files
print_info "Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

# Create superuser
print_info "Creating superuser account..."
docker-compose exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@securepress.local').exists():
    User.objects.create_superuser(
        email='admin@securepress.local',
        password='admin',
        first_name='Admin',
        last_name='User'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
EOF

# Start frontend
print_info "Starting frontend..."
docker-compose up -d frontend

# Start nginx (if configured)
if [ -f "./nginx/nginx.conf" ]; then
    docker-compose up -d nginx
fi

# Installation complete
echo ""
print_success "═══════════════════════════════════════════════════════"
print_success "  SecurePress Installation Complete! 🎉"
print_success "═══════════════════════════════════════════════════════"
echo ""
echo "Access your application at:"
echo ""
echo "  📱 Frontend:        http://localhost:3000"
echo "  🔌 Backend API:     http://localhost:8000/api"
echo "  📚 API Docs:        http://localhost:8000/api/schema/swagger-ui/"
echo "  👤 Admin Panel:     http://localhost:3000/admin"
echo ""
echo "Default credentials:"
echo "  Email:    admin@securepress.local"
echo "  Password: admin"
echo ""
print_warning "IMPORTANT: Change the default password immediately!"
echo ""
echo "Useful commands:"
echo "  make start      - Start all services"
echo "  make stop       - Stop all services"
echo "  make logs       - View logs"
echo "  make shell      - Access Django shell"
echo ""
print_success "Happy content managing! 🚀"
echo ""
