# Installation Guide

> Complete guide to installing and configuring SecurePress

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Installation](#quick-installation)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

Before installing SecurePress, ensure you have the following installed:

### Required

- **Docker** 20.10 or higher
  - Download: https://docs.docker.com/get-docker/
  - Verify: `docker --version`

- **Docker Compose** 2.0 or higher
  - Usually included with Docker Desktop
  - Verify: `docker-compose --version` or `docker compose version`

### System Requirements

- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 10GB minimum free space
- **Operating System**: 
  - Linux (Ubuntu 20.04+, Debian 11+, etc.)
  - macOS 11+ (Big Sur or later)
  - Windows 10/11 with WSL2

## Quick Installation

The fastest way to get SecurePress running is with our one-command installer:

```bash
git clone https://github.com/connektiv8/SecurePress.git
cd SecurePress
./install.sh
```

That's it! The script will:

1. Check for Docker and Docker Compose
2. Generate secure environment files
3. Build Docker images
4. Start all services
5. Run database migrations
6. Create a superuser account

### Access Your Site

After installation completes:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/
- **Admin Panel**: http://localhost:3000/admin

### Default Credentials

```
Email: admin@securepress.local
Password: admin
```

**⚠️ IMPORTANT**: Change these credentials immediately after first login!

## Manual Installation

If you prefer more control over the installation process:

### Step 1: Clone the Repository

```bash
git clone https://github.com/connektiv8/SecurePress.git
cd SecurePress
```

### Step 2: Create Environment Files

#### Backend Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set secure values:

```env
# Generate a secure secret key
DJANGO_SECRET_KEY=your-super-secret-key-here

# Database credentials
POSTGRES_DB=securepress
POSTGRES_USER=securepress
POSTGRES_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend Environment

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=SecurePress
```

#### Root Environment

Create `.env` in the project root:

```bash
POSTGRES_DB=securepress
POSTGRES_USER=securepress
POSTGRES_PASSWORD=your-secure-password
```

### Step 3: Build Images

```bash
docker-compose build
```

This will build:
- PostgreSQL 18.1 database
- Django 6.0 backend
- React + Vite frontend

### Step 4: Start Services

```bash
# Start database first
docker-compose up -d db

# Wait for database to be ready
sleep 10

# Start backend
docker-compose up -d backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Start frontend
docker-compose up -d frontend
```

### Step 5: Verify Installation

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f
```

## Configuration

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Django secret key (required) | - |
| `DJANGO_DEBUG` | Enable debug mode | `False` |
| `DJANGO_ALLOWED_HOSTS` | Allowed hostnames | `localhost,127.0.0.1` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `JWT_ACCESS_TOKEN_LIFETIME` | Access token lifetime (minutes) | `5` |
| `JWT_REFRESH_TOKEN_LIFETIME` | Refresh token lifetime (days) | `1` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | - |
| `EMAIL_BACKEND` | Email backend class | `console` |

#### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application name | `SecurePress` |

### Plugin Configuration

To enable the SecureCommerce plugin:

1. Edit `backend/.env` and add:
   ```env
   PLUGINS_ENABLED=securecommerce
   ```

2. Restart the backend:
   ```bash
   docker-compose restart backend
   ```

## Troubleshooting

### Port Conflicts

If ports 3000, 5432, or 8000 are already in use:

```bash
# Edit docker-compose.yml and change ports
ports:
  - "8080:8000"  # Backend
  - "3001:3000"  # Frontend
  - "5433:5432"  # Database
```

### Database Connection Issues

```bash
# Check database logs
docker-compose logs db

# Verify database is running
docker-compose ps db

# Restart database
docker-compose restart db
```

### Permission Issues

```bash
# Fix file permissions
chmod +x install.sh
chmod +x backend/manage.py

# Fix ownership (Linux/macOS)
sudo chown -R $USER:$USER .
```

### Migration Errors

```bash
# Reset database (⚠️ destroys all data!)
docker-compose down -v
docker-compose up -d db
sleep 10
docker-compose exec backend python manage.py migrate
```

### Frontend Build Issues

```bash
# Clear node modules and rebuild
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
docker-compose restart frontend
```

## Production Deployment

For production deployments, see the full deployment guide at [docs/DEPLOYMENT.md](./DEPLOYMENT.md).

Key considerations:

1. Use production settings: `DJANGO_SETTINGS_MODULE=securepress.settings.production`
2. Set `DJANGO_DEBUG=False`
3. Configure proper domain names in `ALLOWED_HOSTS`
4. Use a reverse proxy (Nginx) with SSL/TLS
5. Set up proper backup strategies
6. Configure monitoring and logging

## Using Make Commands

SecurePress includes helpful Make commands:

```bash
make help        # Show all available commands
make install     # Run installation
make start       # Start all services
make stop        # Stop all services
make restart     # Restart all services
make logs        # View logs
make migrate     # Run database migrations
make shell       # Access Django shell
make test        # Run tests
make clean       # Clean up (removes data!)
```

## Next Steps

After successful installation:

1. **Change Default Password**: Login and change the admin password
2. **Configure Email**: Set up email for password resets
3. **Create Content**: Start creating posts and pages
4. **Customize Theme**: Choose a theme from the admin interface
5. **Read Documentation**: Explore [ARCHITECTURE.md](./ARCHITECTURE.md) and [SECURITY.md](./SECURITY.md)

## Getting Help

- **Documentation**: Read the complete docs in the `docs/` directory
- **Issues**: Report bugs at https://github.com/connektiv8/SecurePress/issues
- **Discussions**: Ask questions at https://github.com/connektiv8/SecurePress/discussions

---

**Next**: [Architecture Overview](./ARCHITECTURE.md)
