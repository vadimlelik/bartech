.PHONY: help build up down restart logs clean init-certs renew-certs health

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Собрать Docker образы
	docker-compose build

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

init-certs: ## Инициализировать SSL сертификаты
	@echo "Инициализация SSL сертификатов..."
	@read -p "Введите ваш email: " email; \
	docker run --rm -it \
		-v certbot-etc:/etc/letsencrypt \
		-v certbot-var:/var/lib/letsencrypt \
		-v $$(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
		certbot/dns-cloudflare certonly \
		--non-interactive \
		--dns-cloudflare \
		--dns-cloudflare-credentials /cloudflare.ini \
		--dns-cloudflare-propagation-seconds 60 \
		--email $$email \
		--agree-tos \
		--no-eff-email \
		-d cvirko-vadim.ru \
		-d phone2.cvirko-vadim.ru \
		-d tv1.cvirko-vadim.ru \
		-d 1phonefree.cvirko-vadim.ru \
		-d 50discount.cvirko-vadim.ru \
		-d phone.cvirko-vadim.ru \
		-d phone3.cvirko-vadim.ru \
		-d phone4.cvirko-vadim.ru \
		-d phone5.cvirko-vadim.ru \
		-d phone6.cvirko-vadim.ru \
		-d shockproof_phone.cvirko-vadim.ru \
		-d laptop.cvirko-vadim.ru \
		-d bicycles.cvirko-vadim.ru \
		-d motoblok.cvirko-vadim.ru \
		-d pc.cvirko-vadim.ru \
		-d scooter.cvirko-vadim.ru \
		-d laptop_2.cvirko-vadim.ru \
		-d tv2.cvirko-vadim.ru \
		-d tv3.cvirko-vadim.ru \
		-d motoblok_1.cvirko-vadim.ru \
		-d motoblok_2.cvirko-vadim.ru

renew-certs: ## Обновить SSL сертификаты вручную
	docker-compose exec certbot certbot renew --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini
	docker-compose exec nginx nginx -s reload

health: ## Проверить здоровье приложения
	@curl -f https://cvirko-vadim.ru/api/health || echo "Health check failed"

status: ## Показать статус всех контейнеров
	docker-compose ps

pull: ## Обновить образы из Docker Hub
	docker-compose pull

update: pull restart ## Обновить и перезапустить приложение

prod-up: ## Запустить в production режиме
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down: ## Остановить production
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

