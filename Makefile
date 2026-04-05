.PHONY: help build up down restart logs clean clean-disk migrate-deploy init-certs init-certs-baratex renew-certs health force-update rebuild-local clean-rebuild diagnose-build build-push-local clean-logs

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

clean-disk: ## Жёсткая очистка Docker на сервере: build cache, неиспользуемые образы/контейнеры/сети (volumes не трогает, запущенные контейнеры не останавливает)
	@echo "📊 Использование диска Docker (до):"
	@docker system df || true
	docker builder prune -f || true
	docker image prune -af || true
	docker container prune -f || true
	docker network prune -f || true
	@echo ""
	@echo "📊 Использование диска Docker (после):"
	@docker system df || true
	@echo "✅ Готово. При необходимости освободить json-логи контейнеров: sudo make clean-logs"

migrate-deploy: ## Применить миграции Prisma (exec если nextjs Up, иначе compose run — одноразовый контейнер)
	@set -e; \
	if [ -f docker-compose.prod.yml ]; then \
		DC="docker compose -f docker-compose.yml -f docker-compose.prod.yml"; \
	else \
		DC="docker compose"; \
	fi; \
	if $$DC exec -T nextjs true 2>/dev/null; then \
		$$DC exec -T nextjs sh -lc 'node /prisma-cli/node_modules/prisma/build/index.js migrate deploy --schema /app/prisma/schema.prisma'; \
	else \
		echo "nextjs не запущен — docker compose run (нужен доступ к БД по DATABASE_URL, postgres в сети compose)"; \
		$$DC run --rm -T --no-deps nextjs sh -lc 'node /prisma-cli/node_modules/prisma/build/index.js migrate deploy --schema /app/prisma/schema.prisma'; \
	fi

seed: ## Заполнить БД данными из папки data/ (categories, products, landing_pages)
	@if ! docker ps --format '{{.Names}}' | grep -q '^bartech-postgres$$'; then \
		echo "ERROR: bartech-postgres не запущен. Запустите: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres"; \
		exit 1; \
	fi
	@PG_USER=$$(grep '^POSTGRES_USER=' .env 2>/dev/null | cut -d= -f2 | tr -d '"' || echo bartech); \
	PG_DB=$$(grep '^POSTGRES_DB=' .env 2>/dev/null | cut -d= -f2 | tr -d '"' || echo bartech); \
	echo "БД: $$PG_DB, пользователь: $$PG_USER"; \
	echo "Копируем SQL-файлы в контейнер..."; \
	docker cp data/categories_rows.sql bartech-postgres:/tmp/categories_rows.sql; \
	docker cp data/products_rows.sql bartech-postgres:/tmp/products_rows.sql; \
	docker cp data/landing_pages_rows.sql bartech-postgres:/tmp/landing_pages_rows.sql; \
	echo "Загружаем категории..."; \
	docker exec bartech-postgres psql -U "$$PG_USER" -d "$$PG_DB" -f /tmp/categories_rows.sql; \
	echo "Загружаем товары..."; \
	docker exec bartech-postgres psql -U "$$PG_USER" -d "$$PG_DB" -f /tmp/products_rows.sql; \
	echo "Загружаем лендинги..."; \
	docker exec bartech-postgres psql -U "$$PG_USER" -d "$$PG_DB" -f /tmp/landing_pages_rows.sql; \
	echo ""; \
	echo "✅ Данные загружены!"; \
	echo "   Профили пользователей (profiles_rows.sql) не импортируются автоматически,"; \
	echo "   т.к. в текущей схеме пользователи хранятся в таблице 'users' с паролями."; \
	echo "   Зарегистрируйте администратора через /register после запуска сайта."

clean-logs: ## Очистить старые логи контейнеров (освобождает место на диске)
	@echo "🧹 Очистка старых логов контейнеров..."
	@bash -c '\
		echo "Размер логов до очистки:"; \
		du -sh /var/lib/docker/containers 2>/dev/null || echo "Не удалось проверить размер"; \
		echo ""; \
		echo "Очистка логов остановленных контейнеров..."; \
		find /var/lib/docker/containers/ -name "*-json.log" -type f -exec truncate -s 0 {} \; 2>/dev/null || true; \
		echo "Очистка завершена!"; \
		echo ""; \
		echo "Размер логов после очистки:"; \
		du -sh /var/lib/docker/containers 2>/dev/null || echo "Не удалось проверить размер"; \
		echo ""; \
		echo "✅ Логи очищены! Работающие контейнеры продолжат писать логи с ротацией." \
	'

diagnose-build: ## Диагностика проблем со сборкой Next.js
	@bash scripts/diagnose-build.sh

build-push-local: ## Собрать образ локально и опубликовать в Docker Hub (для случаев, когда сборка на сервере зависает)
	@bash scripts/build-and-push-local.sh

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

init-certs-baratex: ## Wildcard SSL для baratex.by и *.baratex.by (нужен для nginx.conf рядом с technobar)
	@echo "Инициализация wildcard SSL для baratex.by..."
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
		-d baratex.by \
		-d "*.baratex.by"

renew-certs: ## Обновить SSL сертификаты вручную (автоматическое обновление настроено в docker-compose.yml)
	docker-compose exec certbot certbot renew \
		--dns-cloudflare \
		--dns-cloudflare-credentials /cloudflare.ini \
		--post-hook "/reload-nginx.sh"

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

pull: ## Обновить образы из Docker Hub и перезапустить контейнеры
	@if [ -f docker-compose.prod.yml ]; then \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull; \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate --remove-orphans; \
	else \
		docker-compose pull; \
		docker-compose up -d --force-recreate --remove-orphans; \
	fi

update: pull ## Обновить и перезапустить приложение (pull уже включает перезапуск)

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
	@bash -c '\
		if [ ! -f .env ]; then \
			echo "ERROR: .env file not found!"; \
			exit 1; \
		fi; \
		echo "Загрузка переменных из .env..."; \
		set -a; \
		while IFS= read -r line || [ -n "$$line" ]; do \
			case "$$line" in \
				\#*|"") continue ;; \
			esac; \
			line=$$(echo "$$line" | sed "s/^[[:space:]]*//;s/[[:space:]]*$$//" | sed "s/[[:space:]]*=[[:space:]]*/=/"); \
			[ -z "$$line" ] && continue; \
			if echo "$$line" | grep -q "="; then \
				export "$$line" 2>/dev/null || true; \
			fi; \
		done < .env; \
		set +a; \
		if [ -z "$$DOCKERHUB_USERNAME" ]; then \
			echo "ERROR: DOCKERHUB_USERNAME не установлен в .env файле!"; \
			exit 1; \
		fi; \
		echo "Очистка Docker кеша..."; \
		docker builder prune -f || true; \
		echo "Удаление старых образов bartech..."; \
		docker images $$DOCKERHUB_USERNAME/bartech --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true; \
		docker images | grep bartech | awk "{print \$$3}" | xargs -r docker rmi -f 2>/dev/null || true; \
		echo "Очистка неиспользуемых образов..."; \
		docker image prune -f || true; \
		echo "Принудительная загрузка нового образа (без кеша)..."; \
		docker pull $$DOCKERHUB_USERNAME/bartech:latest --no-cache || docker pull $$DOCKERHUB_USERNAME/bartech:latest; \
		echo "Остановка контейнеров..."; \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml down; \
		echo "Удаление старых контейнеров..."; \
		docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true; \
		echo "Запуск с новым образом..."; \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate --remove-orphans; \
		echo "✅ Обновление завершено!" \
	'

rebuild-local: ## Пересобрать образ локально на сервере (если Docker Hub недоступен)
	@echo "🔨 Локальная пересборка образа..."
	@bash -c '\
		if [ ! -f .env ]; then \
			echo "ERROR: .env file not found!"; \
			exit 1; \
		fi; \
		if [ ! -f Dockerfile ]; then \
			echo "ERROR: Dockerfile not found!"; \
			exit 1; \
		fi; \
		if [ ! -f package.json ]; then \
			echo "ERROR: package.json not found!"; \
			exit 1; \
		fi; \
		echo "Загрузка переменных из .env..."; \
		set -a; \
		while IFS= read -r line || [ -n "$$line" ]; do \
			case "$$line" in \
				\#*|"") continue ;; \
			esac; \
			line=$$(echo "$$line" | sed "s/^[[:space:]]*//;s/[[:space:]]*$$//" | sed "s/[[:space:]]*=[[:space:]]*/=/"); \
			[ -z "$$line" ] && continue; \
			if echo "$$line" | grep -q "="; then \
				export "$$line" 2>/dev/null || true; \
			fi; \
		done < .env; \
		set +a; \
		echo "Проверка обязательных переменных..."; \
		if [ -z "$$AUTH_SECRET" ] || [ $${#AUTH_SECRET} -lt 32 ]; then \
			echo "ERROR: AUTH_SECRET должен быть в .env (минимум 32 символа) для подписи сессий."; \
			exit 1; \
		fi; \
		echo "Остановка контейнеров..."; \
		docker-compose -f docker-compose.yml down || true; \
		docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true; \
		echo "Пересборка образа без кеша (используя docker-compose.yml для локальной сборки)..."; \
		echo "Это может занять несколько минут..."; \
		if ! docker-compose -f docker-compose.yml build --no-cache nextjs; then \
			echo "ERROR: Build failed! Проверьте логи выше."; \
			exit 1; \
		fi; \
		echo "Запуск с локально собранным образом..."; \
		docker-compose -f docker-compose.yml up -d --force-recreate --remove-orphans; \
		echo "✅ Локальная пересборка завершена!"; \
		echo "Проверьте статус: docker-compose ps" \
	'

clean-rebuild: ## Полная очистка и пересборка всех контейнеров без кэша
	@echo "🧹 Полная очистка Docker ресурсов..."
	@bash -c '\
		echo "1. Остановка всех контейнеров..."; \
		docker-compose -f docker-compose.yml down 2>/dev/null || true; \
		docker-compose -f docker-compose.yml -f docker-compose.prod.yml down 2>/dev/null || true; \
		echo "2. Удаление всех контейнеров проекта..."; \
		docker rm -f bartech-nextjs bartech-nginx bartech-certbot 2>/dev/null || true; \
		docker ps -a --filter "name=bartech" --format "{{.ID}}" | xargs -r docker rm -f 2>/dev/null || true; \
		echo "3. Удаление всех образов проекта..."; \
		docker images --filter "reference=*bartech*" --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true; \
		docker images --filter "reference=*nextjs*" --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true; \
		if [ -f .env ]; then \
			set -a; \
			while IFS= read -r line || [ -n "$$line" ]; do \
				case "$$line" in \
					\#*|"") continue ;; \
				esac; \
				line=$$(echo "$$line" | sed "s/^[[:space:]]*//;s/[[:space:]]*$$//" | sed "s/[[:space:]]*=[[:space:]]*/=/"); \
				[ -z "$$line" ] && continue; \
				if echo "$$line" | grep -q "="; then \
					export "$$line" 2>/dev/null || true; \
				fi; \
			done < .env; \
			set +a; \
			if [ -n "$$DOCKERHUB_USERNAME" ]; then \
				echo "Удаление образов из Docker Hub..."; \
				docker images $$DOCKERHUB_USERNAME/bartech --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true; \
			fi; \
		fi; \
		echo "4. Очистка build cache..."; \
		docker builder prune -af || true; \
		echo "5. Очистка неиспользуемых образов..."; \
		docker image prune -af || true; \
		echo "6. Очистка неиспользуемых контейнеров..."; \
		docker container prune -f || true; \
		echo "7. Очистка неиспользуемых сетей..."; \
		docker network prune -f || true; \
		echo "8. Полная очистка системы Docker (кроме volumes)..."; \
		docker system prune -af || true; \
		echo "✅ Очистка завершена!"; \
		echo ""; \
		echo "🔨 Пересборка всех контейнеров без кэша..."; \
		if [ ! -f .env ]; then \
			echo "ERROR: .env file not found!"; \
			exit 1; \
		fi; \
		if [ ! -f Dockerfile ]; then \
			echo "ERROR: Dockerfile not found!"; \
			exit 1; \
		fi; \
		echo "Загрузка переменных из .env..."; \
		set -a; \
		while IFS= read -r line || [ -n "$$line" ]; do \
			case "$$line" in \
				\#*|"") continue ;; \
			esac; \
			line=$$(echo "$$line" | sed "s/^[[:space:]]*//;s/[[:space:]]*$$//" | sed "s/[[:space:]]*=[[:space:]]*/=/"); \
			[ -z "$$line" ] && continue; \
			if echo "$$line" | grep -q "="; then \
				export "$$line" 2>/dev/null || true; \
			fi; \
		done < .env; \
		set +a; \
		echo "Проверка обязательных переменных..."; \
		if [ -z "$$AUTH_SECRET" ] || [ $${#AUTH_SECRET} -lt 32 ]; then \
			echo "ERROR: AUTH_SECRET должен быть в .env (минимум 32 символа) для подписи сессий."; \
			exit 1; \
		fi; \
		echo "Пересборка образа без кэша..."; \
		echo "Это может занять несколько минут..."; \
		if ! docker-compose -f docker-compose.yml build --no-cache nextjs; then \
			echo "ERROR: Build failed! Проверьте логи выше."; \
			exit 1; \
		fi; \
		echo "Запуск всех контейнеров..."; \
		docker-compose -f docker-compose.yml up -d --force-recreate --remove-orphans; \
		echo "✅ Полная пересборка завершена!"; \
		echo "Проверьте статус: docker-compose ps" \
	'

