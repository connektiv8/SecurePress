# SecurePress AI Coding Guidelines

## Project Overview
SecurePress is a security-first CMS alternative to WordPress, built with Django REST Framework (backend) and React/TypeScript (frontend), containerized with Docker. The project emphasizes security at every layer while maintaining developer productivity.

## Architecture Essentials

### Three-Tier Structure
- **Frontend** (port 3000): React 18 + TypeScript + Vite, using TanStack Query for server state and Zustand for client state
- **Backend** (port 8000): Django 6.0 + DRF, environment-based settings (`securepress/settings/base.py`, `development.py`, `production.py`)
- **Database** (port 5432): PostgreSQL 18.1 with ORM-only access (no raw SQL)

### Core Apps Organization
- `core/`: Models layer - split into `models/user.py`, `models/post.py`, `models/page.py`, `models/media.py`
- `api/`: REST endpoints - ViewSets in `views/`, serializers in `serializers/`, central routing via DRF router
- `authentication/`: JWT-based auth using django-rest-knox (5min access tokens, 1day refresh tokens)
- `themes/`: Theme engine with visual editor support
- `marketplace/`: Plugin/theme marketplace integration

## Development Workflows

### Environment Setup
```bash
# First time setup
./install.sh  # Generates .env files, builds containers, runs migrations, creates superuser

# Daily workflows (use Makefile, not docker-compose directly)
make start    # Start all services
make logs     # Follow logs (or logs-backend/logs-frontend for specific)
make migrate  # Run migrations after model changes
make test     # Run pytest (backend) and npm test (frontend)
```

### Making Changes
1. **Backend changes**: Always restart backend container after model/settings changes (`make restart` or `docker-compose restart backend`)
2. **Migrations**: Run `make makemigrations` then `make migrate` - never commit without migrations
3. **Frontend**: Vite provides hot reload, but restart if env vars change

## Code Conventions

### Backend (Django)
- **Models**: Use `settings.AUTH_USER_MODEL` for ForeignKey to User (never import User directly)
- **Permissions**: Extend `api/permissions.py` classes (`IsAuthorOrReadOnly`, `IsEditorOrReadOnly`, `IsAdminUser`)
  - Example: `permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]`
- **ViewSets**: Use DRF ViewSets for CRUD, register in `api/urls.py` router (see `PostViewSet` pattern)
- **User roles**: Check via `request.user.is_editor`, `request.user.is_admin`, or `request.user.role` (admin/editor/author/subscriber)
- **Settings**: Load secrets from env vars via `os.getenv()` in `settings/base.py`, never hardcode

### Frontend (React/TypeScript)
- **API calls**: Use `services/api.ts` axios instance (handles token refresh interceptor automatically)
- **Auth state**: Access via `useAuth()` hook from `AuthContext.tsx` - provides `user`, `isAuthenticated`, `login()`, `logout()`
- **Types**: Define in `types/` directory (separate files: `user.ts`, `post.ts`, `page.ts`, `media.ts`)
- **Routing**: Protected routes use `<ProtectedRoute>` wrapper (see `admin/` components)
- **State management**: Server state via TanStack Query, client state via Zustand
- **Admin Layout**: All admin pages use `<AdminSidebar>` component (WordPress-style collapsible menu)
  - WordPress-familiar structure: Dashboard → Posts → Media → Pages → Comments → Appearance → Plugins → Users → Tools → Settings
  - Collapsible submenus with state management (e.g., Posts includes All Posts, Add New, Categories, Tags)
  - Top admin bar with user dropdown and "Visit Site" link

### Security Requirements
- **Authentication**: All API endpoints except login/register require JWT token (set in axios interceptor)
- **File uploads**: Validate in `core/models/media.py` - whitelist file types, enforce size limits
- **Permissions**: Never use `allow_any` permission in production code
- **CORS**: Configured in `settings/base.py` via `CORS_ALLOWED_ORIGINS` env var
- **Passwords**: Django PBKDF2 hashing (automatic), 10 char minimum in validation

## Integration Points

### Frontend ↔ Backend
- Base URL: `VITE_API_URL` env var (default: `http://localhost:8000/api`)
- Auth flow: Login → store access/refresh tokens in localStorage → axios interceptor adds `Authorization: Bearer {token}`
- Token refresh: 401 response triggers automatic refresh via `/auth/token/refresh/` endpoint

### Docker Services
- Backend depends on `db` (healthcheck waits for PostgreSQL ready)
- Frontend depends on `backend` (API availability)
- Nginx serves as reverse proxy in production (not used in dev)
- Volumes: `postgres_data` (persistent), backend/frontend code (bind mounts for hot reload)

### Plugin System
- Plugins live in `/plugins/` directory with `plugin.json` metadata
- Each plugin: isolated models, serializers, views, urls following Django app structure
- Reference: `plugins/securecommerce/` example

### Theme System
- Themes in `/themes/` with `theme.json` config (imported from WordPress/Shopify themes)
- Block-based visual editor (grid-based drag-and-drop)
- Templates in `templates/`, blocks in `blocks/`, widgets in `widgets/`

## Testing Strategy
- **Backend**: pytest with Django plugin (`pytest.ini` configured for coverage)
  - Run: `make test-backend` or `docker-compose exec backend pytest`
  - Markers: `@pytest.mark.unit`, `@pytest.mark.integration`, `@pytest.mark.security`
- **Frontend**: Vite test runner
  - Run: `make test-frontend` or `docker-compose exec frontend npm test`

## Common Gotchas
- **Token expiry**: Frontend axios interceptor handles refresh automatically, but check localStorage for stale tokens on auth errors
- **Port conflicts**: Ensure ports 3000, 8000, 5432 available before `make start`
- **Migration conflicts**: Always pull latest before creating migrations to avoid merge conflicts
- **Static files**: Run `make collectstatic` before production deployment
- **Role checks**: Use `is_editor`/`is_admin` properties on User model (defined in `core/models/user.py`), not `role == 'editor'` string comparison

## Key Files Reference
- [backend/securepress/settings/base.py](backend/securepress/settings/base.py) - Core Django config, installed apps, middleware
- [backend/api/permissions.py](backend/api/permissions.py) - Custom permission classes for role-based access
- [backend/core/models/user.py](backend/core/models/user.py) - Custom User model with email auth and role system
- [frontend/src/services/api.ts](frontend/src/services/api.ts) - Axios instance with auth interceptors
- [frontend/src/contexts/AuthContext.tsx](frontend/src/contexts/AuthContext.tsx) - Auth state management
- [frontend/src/components/Layout/AdminSidebar.tsx](frontend/src/components/Layout/AdminSidebar.tsx) - WordPress-style admin navigation
- [frontend/src/App.tsx](frontend/src/App.tsx) - All admin routes and navigation structure
- [docker-compose.yml](docker-compose.yml) - Service orchestration and dependencies
- [Makefile](Makefile) - All development commands (prefer over direct docker-compose)

## Admin Menu Structure (WordPress-Compatible)
SecurePress uses a WordPress-familiar admin menu for easy adoption:
- **Dashboard**: Overview, stats, recent activity
- **Posts**: All Posts, Add New, Categories, Tags
- **Media**: Library, Add New (file upload)
- **Pages**: All Pages, Add New
- **Comments**: Moderation and management
- **Appearance**: Themes, Customize, Widgets, Menus
- **Plugins**: Installed Plugins, Add New
- **Users**: All Users, Add New, Your Profile
- **Tools**: Import, Export, Site Health
- **Settings**: General, Writing, Reading, Discussion, Media, Permalinks, Privacy

New admin components should use `<AdminSidebar>` wrapper and follow existing patterns in `admin/` directory.
