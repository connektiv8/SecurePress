# SecurePress

> Modern, security-first CMS built with React/TypeScript and Django/PostgreSQL

SecurePress is a WordPress alternative designed from the ground up with security as the primary concern. Built on a modern tech stack, it provides a powerful content management system that's both secure by default and easy to install.

## 🚀 Key Features

- **Security First**: Built with security best practices from day one
  - JWT authentication with token refresh
  - Content Security Policy (CSP) headers
  - SQL injection protection via Django ORM
  - XSS and CSRF protection
  - Rate limiting on sensitive endpoints
  - Secure file upload handling
  - HTTPS enforcement in production

- **Modern Tech Stack**
  - Backend: Django 6.0 + PostgreSQL 18.1
  - Frontend: React 18 + TypeScript + Vite
  - API: Django REST Framework with OpenAPI docs
  - Containerized: Docker & Docker Compose

- **Developer Friendly**
  - One-command installation
  - Hot reload in development
  - Comprehensive API documentation
  - Type-safe frontend and backend
  - Well-structured and maintainable codebase

- **Content Management**
  - Posts and Pages with rich text editing
  - Media library with image optimization
  - User management with role-based access
  - SEO optimization built-in
  - Draft/Publish workflow

## ⚡ Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/connektiv8/SecurePress.git
cd SecurePress

# Run the one-command installation
./install.sh

# That's it! Access the application at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000/api
# - Admin Panel: http://localhost:3000/admin
```

The installation script will:
- Check prerequisites
- Generate secure environment files
- Build and start all services
- Run database migrations
- Create a superuser account

## 📚 Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed installation instructions
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design decisions
- [Security](docs/SECURITY.md) - Security features and best practices
- [API Documentation](docs/API.md) - REST API reference
- [Contributing](docs/CONTRIBUTING.md) - How to contribute to SecurePress

## 🏗️ Architecture Overview

SecurePress follows a modern three-tier architecture:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Django    │────▶│ PostgreSQL  │
│  Frontend   │◀────│   Backend   │◀────│  Database   │
│ (Port 3000) │     │ (Port 8000) │     │ (Port 5432) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │
       └────────────────────┘
              Nginx
         (Reverse Proxy)
```

### Technology Stack

**Backend**
- Django 6.0 - Web framework
- Django REST Framework - API framework
- PostgreSQL 18.1 - Database
- JWT - Authentication
- Pillow - Image processing
- pytest - Testing

**Frontend**
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- React Router - Routing
- Axios - HTTP client
- TanStack Query - Data fetching
- Zustand - State management

**Infrastructure**
- Docker & Docker Compose
- Nginx - Reverse proxy
- GitHub Actions - CI/CD

## 🛠️ Development

### Common Commands

```bash
# Start all services
make start

# Stop all services
make stop

# View logs
make logs

# Run tests
make test

# Run migrations
make migrate

# Create superuser
make superuser

# Access Django shell
make shell

# Clean up
make clean
```

### Project Structure

```
SecurePress/
├── backend/          # Django backend application
├── frontend/         # React frontend application
├── docs/            # Documentation
├── docker-compose.yml
├── install.sh
└── Makefile
```

## 🔒 Security

SecurePress takes security seriously. All security-related features and practices are documented in our [Security Guide](docs/SECURITY.md).

Key security features:
- No default credentials
- Environment-based configuration
- Secure password hashing (Django's PBKDF2)
- JWT token authentication
- Rate limiting on auth endpoints
- Input validation and sanitization
- SQL injection protection
- XSS and CSRF protection
- Secure file upload handling
- Security headers (CSP, HSTS, etc.)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Pull request process
- Coding standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ by the SecurePress team and contributors.

Inspired by WordPress but built for the modern web with security as a first-class citizen.

## 📞 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/connektiv8/SecurePress/issues)
- Discussions: [GitHub Discussions](https://github.com/connektiv8/SecurePress/discussions)
