# Architecture Overview

> Technical architecture and design decisions for SecurePress

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Theme System](#theme-system)
- [Plugin System](#plugin-system)
- [Deployment Architecture](#deployment-architecture)

## System Overview

SecurePress follows a modern **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  React 18 + TypeScript + Vite + DaisyUI/Tailwind       │
│  - Admin Dashboard                                       │
│  - Visual Theme Editor                                   │
│  - Public Frontend (Theme-based)                        │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ REST API / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  Django 6.0 + Django REST Framework                     │
│  - Core CMS Logic                                        │
│  - Authentication & Authorization                        │
│  - API Endpoints                                         │
│  - Plugin System                                         │
│  - Theme Engine                                          │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ ORM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  PostgreSQL 18.1                                         │
│  - Content Storage                                       │
│  - User Data                                             │
│  - Theme Configurations                                  │
│  - Media Files (filesystem + DB refs)                   │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Web Framework** | Django | 6.0 | Core application framework |
| **API Framework** | Django REST Framework | 3.15.2 | RESTful API |
| **Database** | PostgreSQL | 18.1 | Primary data store |
| **Database Driver** | psycopg | 3.2.3 | PostgreSQL adapter |
| **Authentication** | JWT (SimpleJWT) | 5.3.1 | Token-based auth |
| **API Documentation** | drf-spectacular | 0.28.0 | OpenAPI/Swagger |
| **Image Processing** | Pillow | 11.0.0 | Media handling |
| **WSGI Server** | Gunicorn | 23.0.0 | Production server |
| **Testing** | pytest + pytest-django | 8.3.4 + 4.9.0 | Test framework |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **UI Library** | React | 18.3.1 | Component-based UI |
| **Language** | TypeScript | 5.7.2 | Type safety |
| **Build Tool** | Vite | 6.0.5 | Fast dev server & bundler |
| **UI Framework** | DaisyUI | 4.12.14 | Component library |
| **CSS Framework** | Tailwind CSS | 3.4.17 | Utility-first CSS |
| **Routing** | React Router | 6.28.0 | Client-side routing |
| **HTTP Client** | Axios | 1.7.9 | API communication |
| **State Management** | Zustand | 5.0.2 | Global state |
| **Data Fetching** | TanStack Query | 5.62.7 | Server state management |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Application packaging |
| **Orchestration** | Docker Compose | Multi-container management |
| **Reverse Proxy** | Nginx | Load balancing, SSL termination |
| **Version Control** | Git | Source code management |

## Application Architecture

### Backend Structure

```
backend/
├── securepress/          # Django project
│   ├── settings/         # Environment-specific settings
│   │   ├── base.py      # Common settings
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py          # URL routing
│   ├── wsgi.py          # WSGI entry point
│   └── asgi.py          # ASGI entry point (WebSocket)
│
├── core/                # Core CMS functionality
│   ├── models/         # Data models
│   │   ├── user.py     # Extended user model
│   │   ├── post.py     # Blog posts
│   │   ├── page.py     # Static pages
│   │   └── media.py    # Media library
│   └── admin.py        # Django admin
│
├── api/                # REST API
│   ├── serializers/    # Data serialization
│   ├── views/          # API endpoints
│   ├── permissions.py  # Access control
│   └── urls.py         # API routing
│
├── authentication/     # Auth system
│   ├── views.py        # Login, logout, etc.
│   └── serializers.py  # Auth data
│
├── themes/             # Theme engine
│   ├── models.py       # Theme, Block, Menu models
│   ├── views.py        # Theme API
│   └── engine.py       # Theme rendering
│
└── plugins/            # Plugin loader
    └── loader.py       # Dynamic plugin loading
```

### Frontend Structure

```
frontend/
├── src/
│   ├── admin/              # Admin dashboard
│   │   ├── Dashboard.tsx
│   │   ├── Posts/         # Post management
│   │   ├── Pages/         # Page management
│   │   ├── Media/         # Media library
│   │   ├── Users/         # User management
│   │   └── Themes/        # Theme manager (NEW)
│   │       ├── ThemeList.tsx
│   │       ├── ThemeEditor.tsx  # Visual editor
│   │       └── BlockLibrary.tsx
│   │
│   ├── components/         # Shared components
│   │   ├── Layout/        # Header, Sidebar, Footer
│   │   ├── Auth/          # Login, Protected Route
│   │   ├── Common/        # Button, Input, Card
│   │   └── Editor/        # Visual editor components (NEW)
│   │       ├── GridEditor.tsx
│   │       ├── BlockEditor.tsx
│   │       ├── WidgetEditor.tsx
│   │       └── MenuBuilder.tsx
│   │
│   ├── services/          # API services
│   │   ├── api.ts         # Axios instance
│   │   ├── auth.ts        # Authentication
│   │   └── themes.ts      # Theme API (NEW)
│   │
│   ├── types/             # TypeScript types
│   │   ├── index.ts
│   │   ├── post.ts
│   │   ├── page.ts
│   │   └── theme.ts       # Theme types (NEW)
│   │
│   └── styles/            # Global styles
│       └── global.css     # Tailwind + custom
│
└── public/                # Static assets
    └── themes/            # Theme files (NEW)
```

## Database Schema

### Core Tables

**users**
- Extended Django user model
- Email-based authentication
- Role-based permissions (admin, editor, author, subscriber)
- Two-factor authentication support

**posts**
- Blog posts with rich content
- Categories and tags (many-to-many)
- Draft/Published workflow
- SEO metadata
- View tracking

**pages**
- Static pages
- Hierarchical structure (parent-child)
- Template selection
- Menu ordering

**media**
- File uploads
- Image metadata (dimensions, size)
- Alt text for accessibility
- Secure file serving

### Theme Tables (NEW)

**themes**
- Installed themes
- Configuration and metadata
- Source tracking (WordPress, Shopify, custom)
- Feature support flags

**blocks**
- Reusable content blocks
- Block attributes and templates
- Category organization
- Theme-specific or core blocks

**page_layouts**
- Visual editor layouts
- Grid-based block placement
- Per-page/post layouts

**menus**
- Navigation menus
- Menu item structure (JSON)
- Location assignments

**widgets**
- Widget instances
- Placement in widget areas
- Configuration per instance

## API Design

### RESTful Endpoints

```
/api/
├── auth/
│   ├── login/              POST   Login
│   ├── logout/             POST   Logout
│   ├── register/           POST   Register
│   ├── token/refresh/      POST   Refresh JWT
│   └── change-password/    POST   Change password
│
├── users/
│   ├── /                   GET    List users
│   ├── /{id}/             GET    User detail
│   ├── /me/               GET    Current user
│   └── /update_profile/   PATCH  Update profile
│
├── posts/
│   ├── /                   GET    List posts
│   ├── /{slug}/           GET    Post detail
│   ├── /                   POST   Create post
│   ├── /{slug}/           PUT    Update post
│   └── /{slug}/           DELETE Delete post
│
├── pages/
│   ├── /                   GET    List pages
│   ├── /{slug}/           GET    Page detail
│   ├── /                   POST   Create page
│   ├── /{slug}/           PUT    Update page
│   └── /{slug}/           DELETE Delete page
│
├── media/
│   ├── /                   GET    List media
│   ├── /{id}/             GET    Media detail
│   ├── /                   POST   Upload file
│   └── /{id}/             DELETE Delete file
│
├── themes/                 (NEW)
│   ├── /                   GET    List themes
│   ├── /{slug}/           GET    Theme detail
│   ├── /{slug}/activate/  POST   Activate theme
│   ├── /blocks/           GET    List blocks
│   └── /menus/            GET    List menus
│
└── schema/
    ├── /                   GET    OpenAPI schema
    ├── /swagger-ui/       GET    Swagger UI
    └── /redoc/            GET    ReDoc UI
```

### Authentication Flow

```
1. User submits credentials
   POST /api/auth/login/
   
2. Server validates and returns JWT tokens
   {
     "access": "eyJ...",
     "refresh": "eyJ...",
     "user": {...}
   }
   
3. Client stores tokens
   localStorage.setItem('access_token', access)
   
4. Client includes token in requests
   Authorization: Bearer eyJ...
   
5. Token expires, client refreshes
   POST /api/auth/token/refresh/
   { "refresh": "eyJ..." }
   
6. Server returns new access token
   { "access": "eyJ..." }
```

## Security Architecture

See [SECURITY.md](./SECURITY.md) for comprehensive security details.

**Key Security Layers:**

1. **Network** - HTTPS only, reverse proxy, rate limiting
2. **Application** - Input validation, CSRF protection, XSS prevention
3. **Authentication** - JWT tokens, 2FA support, password hashing
4. **Authorization** - Role-based permissions, object-level permissions
5. **Data** - SQL injection protection, file upload validation

## Theme System

### Architecture

The theme system supports:
- **Visual Editor**: Grid-based drag-and-drop
- **Block System**: Reusable content blocks
- **Widget Areas**: Flexible sidebars and footers
- **Menu Builder**: Visual menu creation
- **Theme Conversion**: WordPress & Shopify import

### Theme Rendering Pipeline

```
1. Request arrives
2. Identify current theme
3. Load theme configuration
4. Fetch page/post content
5. Apply page layout (visual editor)
6. Render blocks with data
7. Process widgets
8. Inject menus
9. Apply theme styles
10. Return HTML response
```

## Plugin System

**SecureCommerce Plugin** (E-commerce functionality):
- Product catalog with variants
- Inventory management
- Order processing
- Multi-channel sync (WooCommerce, Shopify)
- Bulk product editing

**Plugin Architecture**:
- Isolated plugin directory (`plugins/`)
- JSON metadata (`plugin.json`)
- Dynamic loading via settings
- Hooks and filters for extensibility

## Deployment Architecture

### Development

```
Docker Compose:
- PostgreSQL container
- Django container (runserver)
- React container (Vite dev server)
- Hot reload enabled
```

### Production

```
             ┌─────────┐
             │  Nginx  │ (SSL, Load Balancer)
             └────┬────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   ┌────▼────┐        ┌────▼────┐
   │ Django  │        │  React  │
   │ + Gun   │───┬───▶│ (Nginx) │
   └─────────┘   │    └─────────┘
                 │
           ┌─────▼──────┐
           │ PostgreSQL │
           └────────────┘
```

**Scaling Strategy**:
- Horizontal scaling of Django (multiple containers)
- PostgreSQL read replicas
- CDN for static/media files
- Redis for caching and sessions

## Performance Considerations

- **Database**: Connection pooling, query optimization, indexes
- **Caching**: Redis for sessions, query results
- **Static Files**: CDN delivery, compression
- **Images**: Lazy loading, responsive images, WebP format
- **Code**: Code splitting, tree shaking, minification

## Monitoring & Logging

- **Application Logs**: Django logging to files/stdout
- **Access Logs**: Nginx access logs
- **Error Tracking**: Integration with Sentry (optional)
- **Performance**: Django Debug Toolbar (development)
- **Database**: Query analysis, slow query log

---

**Next**: [Security Documentation](./SECURITY.md)
