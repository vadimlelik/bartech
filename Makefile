.PHONY: help build up down restart logs clean init-certs renew-certs health force-update rebuild-local

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Собрать Docker образы
	docker-compose build

build-nextjs: ## Пересобрать только контейнер Next.js
	docker-compose build nextjs
	docker-compose up -d nextjs

up: ## Запустить все сервисы
	docker-compose up -d

down: ## Остановить все сервисы
	docker-compose down

restart: ## Перезапустить все сервисы
	docker-compose restart

logs: ## Показать логи всех сервисов
	docker-compose logs -f

logs-nextjs: ## Показать логи Next.js
	docker-compose logs -f nextjs

logs-nginx: ## Показать логи Nginx
	docker-compose logs -f nginx

logs-certbot: ## Показать логи CertBot
	docker-compose logs -f certbot

clean: ## Очистить неиспользуемые Docker ресурсы
	docker system prune -f
	docker image prune -f

init-certs: ## Инициализировать wildcard SSL сертификаты для technobar.by и *.technobar.by
	@echo "Инициализация wildcard SSL сертификатов..."
	@echo "Сертификат будет работать для technobar.by и всех поддоменов *.technobar.by"
	@read -p "Введите ваш email: " email; \
	docker run --rm -it \
		-v technobar_certbot-etc:/etc/letsencrypt \
		-v technobar_certbot-var:/var/lib/letsencrypt \
		-v $$(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
		certbot/dns-cloudflare certonly \
		--non-interactive \
		--force-renewal \
		--dns-cloudflare \
		--dns-cloudflare-credentials /cloudflare.ini \
		--dns-cloudflare-propagation-seconds 60 \
		--email $$email \
		--agree-tos \
		--no-eff-email \
		-d technobar.by \
		-d "*.technobar.by"

renew-certs: ## Обновить SSL сертификаты вручную
	docker-compose exec certbot certbot renew --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini
	docker-compose exec nginx nginx -s reload

cleanup-certs: ## Удалить старые сертификаты перед пересозданием (используйте перед init-certs)
	@echo "⚠️  ВНИМАНИЕ: Это удалит все существующие сертификаты"
	@read -p "Продолжить? (yes/no): " confirm; \
	if [ "$$confirm" != "yes" ]; then \
		echo "Отменено."; \
		exit 0; \
	fi; \
	docker-compose down; \
	docker run --rm \
		-v technobar_certbot-etc:/etc/letsencrypt \
		-v technobar_certbot-var:/var/lib/letsencrypt \
		alpine:latest \
		sh -c "rm -rf /etc/letsencrypt/live/technobar.by* /etc/letsencrypt/renewal/technobar.by* /etc/letsencrypt/archive/technobar.by*"; \
	echo "✅ Старые сертификаты удалены. Теперь запустите: make init-certs"

health: ## Проверить здоровье приложения
	@curl -f https://technobar.by/api/health || echo "Health check failed"

status: ## Показать статус всех контейнеров
	docker-compose ps

pull: ## Обновить образы из Docker Hub
	docker-compose pull

update: pull restart ## Обновить и перезапустить приложение

prod-up: ## Запустить в production режиме
	@echo "Checking Docker volumes..."
	@docker volume ls | grep -q technobar_certbot-etc || docker volume create technobar_certbot-etc
	@docker volume ls | grep -q technobar_certbot-var || docker volume create technobar_certbot-var
	@echo "Volumes ready"
	@echo "Removing old containers if they exist..."
	@docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true
	@echo "Starting containers..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans

prod-down: ## Остановить production
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

force-update: ## Принудительно обновить образ из Docker Hub и перезапустить
	@echo "🔄 Принудительное обновление образа из Docker Hub..."
	@if [ -z "$$DOCKERHUB_USERNAME" ]; then \
		echo "ERROR: DOCKERHUB_USERNAME не установлен в .env файле!"; \
		exit 1; \
	fi
	@echo "Удаление старых образов..."
	@docker images $$DOCKERHUB_USERNAME/bartech --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true
	@echo "Принудительная загрузка нового образа..."
	@docker pull $$DOCKERHUB_USERNAME/bartech:latest
	@echo "Остановка контейнеров..."
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
	@echo "Удаление старых контейнеров..."
	@docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true
	@echo "Запуск с новым образом..."
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate --remove-orphans
	@echo "✅ Обновление завершено!"

rebuild-local: ## Пересобрать образ локально на сервере (если Docker Hub недоступен)
	@echo "🔨 Локальная пересборка образа..."
	@if [ ! -f .env ]; then \
		echo "ERROR: .env file not found!"; \
		exit 1; \
	fi
	@if [ ! -f Dockerfile ]; then \
		echo "ERROR: Dockerfile not found!"; \
		exit 1; \
	fi
	@if [ ! -f package.json ]; then \
		echo "ERROR: package.json not found!"; \
		exit 1; \
	fi
	@echo "Загрузка переменных из .env..."
	@set -a; \
	while IFS= read -r line || [ -n "$$line" ]; do \
		case "$$line" in \
			\#*|'') continue ;; \
		esac; \
		line=$$(echo "$$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$$//'); \
		[ -z "$$line" ] && continue; \
		if echo "$$line" | grep -q '='; then \
			export "$$line" 2>/dev/null || true; \
		fi; \
	done < .env; \
	set +a
	@echo "Проверка обязательных переменных..."
	@if [ -z "$$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then \
		echo "ERROR: NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY должны быть в .env файле!"; \
		exit 1; \
	fi
	@echo "Остановка контейнеров..."
	@docker-compose -f docker-compose.yml down || true
	@docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true
	@echo "Пересборка образа без кеша (используя docker-compose.yml для локальной сборки)..."
	@echo "Это может занять несколько минут..."
	@docker-compose -f docker-compose.yml build --no-cache nextjs || { \
		echo "ERROR: Build failed! Проверьте логи выше."; \
		exit 1; \
	}
	@echo "Запуск с локально собранным образом..."
	@docker-compose -f docker-compose.yml up -d --force-recreate --remove-orphans
	@echo "✅ Локальная пересборка завершена!"
	@echo "Проверьте статус: docker-compose ps"

