# ============================================
# Mono Project - Makefile
# ============================================
# Docker and development commands

.PHONY: help build up down logs clean dev prod restart

# Default target
help:
	@echo "Mono Project - Available Commands"
	@echo "=================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development databases (MongoDB, PostgreSQL, Redis)"
	@echo "  make dev-down     - Stop development databases"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build all Docker images"
	@echo "  make up           - Start all production services"
	@echo "  make down         - Stop all production services"
	@echo "  make logs         - View production logs"
	@echo "  make restart      - Restart all production services"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Remove all containers, volumes, and images"
	@echo "  make shell        - Open shell in workflow-backend container"
	@echo "  make mongo-shell  - Open MongoDB shell"
	@echo "  make ps           - List running containers"
	@echo ""

# ==========================================
# Development Commands
# ==========================================
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo ""
	@echo "Development services started:"
	@echo "  - MongoDB:       localhost:27017"
	@echo "  - PostgreSQL:    localhost:5432"
	@echo "  - Redis:         localhost:6379"
	@echo "  - Mongo Express: http://localhost:8081"
	@echo ""
	@echo "Run 'npm run dev' in apps/workflow-backend to start the API"

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-clean:
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# ==========================================
# Production Commands
# ==========================================
build:
	docker-compose build

up:
	docker-compose up -d
	@echo ""
	@echo "Production services started:"
	@echo "  - Workflow API:  http://localhost:3000"
	@echo "  - Airflow API:   http://localhost:9090"
	@echo "  - MongoDB:       localhost:27017"
	@echo ""

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

ps:
	docker-compose ps

# ==========================================
# Utility Commands
# ==========================================
clean:
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

shell:
	docker exec -it mono-workflow-backend /bin/sh

mongo-shell:
	docker exec -it mono-mongodb mongosh -u admin -p Admin@123 --authenticationDatabase admin

redis-cli:
	docker exec -it mono-redis redis-cli -a mono_redis_password

# ==========================================
# Build specific services
# ==========================================
build-backend:
	docker-compose build workflow-backend

build-airflow:
	docker-compose build airflow-apiserver airflow-scheduler airflow-dag-processor

# ==========================================
# Logs for specific services
# ==========================================
logs-backend:
	docker-compose logs -f workflow-backend

logs-airflow:
	docker-compose logs -f airflow-apiserver airflow-scheduler

logs-mongo:
	docker-compose logs -f mongodb

# ==========================================
# Health checks
# ==========================================
health:
	@echo "Checking service health..."
	@curl -s http://localhost:3000/ping && echo " ✓ Workflow Backend OK" || echo " ✗ Workflow Backend FAILED"
	@curl -s http://localhost:9090/health && echo " ✓ Airflow API OK" || echo " ✗ Airflow API FAILED"
	@docker exec mono-mongodb mongosh --eval "db.adminCommand('ping')" -u admin -p Admin@123 --authenticationDatabase admin --quiet && echo " ✓ MongoDB OK" || echo " ✗ MongoDB FAILED"
	@docker exec mono-redis redis-cli -a mono_redis_password ping && echo " ✓ Redis OK" || echo " ✗ Redis FAILED"

