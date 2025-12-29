.PHONY: help install start stop restart logs clean test migrate shell superuser build

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)SecurePress - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Run the installation script
	@echo "$(BLUE)Running installation...$(NC)"
	@./install.sh

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker-compose build

start: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Services started successfully!$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"

stop: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Services stopped$(NC)"

restart: stop start ## Restart all services

logs: ## View logs from all services
	@docker-compose logs -f

logs-backend: ## View backend logs
	@docker-compose logs -f backend

logs-frontend: ## View frontend logs
	@docker-compose logs -f frontend

logs-db: ## View database logs
	@docker-compose logs -f db

ps: ## List all running containers
	@docker-compose ps

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	@docker-compose exec backend python manage.py migrate
	@echo "$(GREEN)Migrations completed$(NC)"

makemigrations: ## Create new migrations
	@echo "$(BLUE)Creating migrations...$(NC)"
	@docker-compose exec backend python manage.py makemigrations
	@echo "$(GREEN)Migrations created$(NC)"

shell: ## Access Django shell
	@docker-compose exec backend python manage.py shell

dbshell: ## Access PostgreSQL shell
	@docker-compose exec db psql -U securepress -d securepress

superuser: ## Create a superuser
	@docker-compose exec backend python manage.py createsuperuser

collectstatic: ## Collect static files
	@echo "$(BLUE)Collecting static files...$(NC)"
	@docker-compose exec backend python manage.py collectstatic --noinput
	@echo "$(GREEN)Static files collected$(NC)"

test: ## Run all tests
	@echo "$(BLUE)Running backend tests...$(NC)"
	@docker-compose exec backend pytest
	@echo "$(BLUE)Running frontend tests...$(NC)"
	@docker-compose exec frontend npm test

test-backend: ## Run backend tests only
	@docker-compose exec backend pytest

test-frontend: ## Run frontend tests only
	@docker-compose exec frontend npm test

test-coverage: ## Run tests with coverage
	@docker-compose exec backend pytest --cov=. --cov-report=html

lint: ## Run linters
	@echo "$(BLUE)Linting backend...$(NC)"
	@docker-compose exec backend python -m ruff check .
	@echo "$(BLUE)Linting frontend...$(NC)"
	@docker-compose exec frontend npm run lint

format: ## Format code
	@echo "$(BLUE)Formatting backend...$(NC)"
	@docker-compose exec backend python -m ruff format .
	@echo "$(BLUE)Formatting frontend...$(NC)"
	@docker-compose exec frontend npm run format

clean: ## Clean up containers, volumes, and build artifacts
	@echo "$(YELLOW)Warning: This will remove all containers, volumes, and data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Cleaning up...$(NC)"; \
		docker-compose down -v; \
		find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true; \
		find . -type f -name "*.pyc" -delete 2>/dev/null || true; \
		rm -rf ./backend/staticfiles 2>/dev/null || true; \
		rm -rf ./frontend/dist 2>/dev/null || true; \
		rm -rf ./frontend/node_modules 2>/dev/null || true; \
		echo "$(GREEN)Cleanup complete$(NC)"; \
	fi

reset-db: ## Reset database (WARNING: destructive)
	@echo "$(YELLOW)Warning: This will delete all data in the database!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Resetting database...$(NC)"; \
		docker-compose down db; \
		docker volume rm securepress_postgres_data || true; \
		docker-compose up -d db; \
		sleep 5; \
		docker-compose up -d backend; \
		sleep 5; \
		$(MAKE) migrate; \
		echo "$(GREEN)Database reset complete$(NC)"; \
	fi

backup-db: ## Backup database to file
	@echo "$(BLUE)Backing up database...$(NC)"
	@mkdir -p ./backups
	@docker-compose exec -T db pg_dump -U securepress securepress > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backed up to ./backups/$(NC)"

restore-db: ## Restore database from latest backup
	@echo "$(BLUE)Restoring database from latest backup...$(NC)"
	@docker-compose exec -T db psql -U securepress securepress < $$(ls -t ./backups/*.sql | head -1)
	@echo "$(GREEN)Database restored$(NC)"

dev-backend: ## Start backend in development mode
	@docker-compose up backend

dev-frontend: ## Start frontend in development mode
	@docker-compose up frontend

prod-build: ## Build production images
	@echo "$(BLUE)Building production images...$(NC)"
	@docker-compose -f docker-compose.prod.yml build
	@echo "$(GREEN)Production images built$(NC)"

update: ## Update dependencies
	@echo "$(BLUE)Updating backend dependencies...$(NC)"
	@docker-compose exec backend pip install --upgrade -r requirements.txt
	@echo "$(BLUE)Updating frontend dependencies...$(NC)"
	@docker-compose exec frontend npm update
	@echo "$(GREEN)Dependencies updated$(NC)"
