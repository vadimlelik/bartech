# Автоматическое обновление SSL сертификатов

## Обзор

Система автоматически обновляет SSL сертификаты Let's Encrypt для домена `technobar.by` и всех поддоменов `*.technobar.by`.

## Как это работает

1. **Автоматическое обновление**: Контейнер `certbot` запускается автоматически и проверяет необходимость обновления сертификатов каждые 12 часов.

2. **Обновление сертификатов**: Если сертификаты требуют обновления (обычно за 30 дней до истечения), они автоматически обновляются через DNS-провайдера Cloudflare.

3. **Перезагрузка Nginx**: После успешного обновления сертификатов автоматически перезагружается Nginx для применения новых сертификатов.

## Компоненты

### Скрипты

- `scripts/auto-renew-certs.sh` - основной скрипт для проверки и обновления сертификатов
- `scripts/reload-nginx.sh` - скрипт для перезагрузки Nginx (вызывается как post-hook)

### Конфигурация

- `docker-compose.yml` - настройка автоматического обновления в контейнере certbot
- `certbot/cloudflare.ini` - учетные данные Cloudflare для DNS-провайдера

## Ручное обновление

Если нужно обновить сертификаты вручную:

```bash
# Через Makefile
make renew-certs

# Или напрямую
./renew-cert.sh

# Или через docker-compose
docker-compose exec certbot certbot renew \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --post-hook "/reload-nginx.sh"
```

## Проверка статуса

Проверить логи автоматического обновления:

```bash
# Логи certbot
docker-compose logs -f certbot

# Или через Makefile
make logs-certbot
```

## Инициализация сертификатов

При первом запуске необходимо инициализировать сертификаты:

```bash
make init-certs
```

Это создаст wildcard сертификат для `technobar.by` и `*.technobar.by`.

## Устранение проблем

### Сертификаты не обновляются

1. Проверьте логи: `docker-compose logs certbot`
2. Убедитесь, что файл `certbot/cloudflare.ini` содержит правильные учетные данные
3. Проверьте, что контейнер certbot запущен: `docker-compose ps`

### Nginx не перезагружается после обновления

1. Проверьте, что контейнер nginx доступен: `docker ps | grep nginx`
2. Перезагрузите Nginx вручную: `docker exec bartech-nginx nginx -s reload`
3. Проверьте логи: `docker-compose logs nginx`

## Безопасность

- Файл `certbot/cloudflare.ini` содержит чувствительные данные и должен быть в `.gitignore`
- Docker socket монтируется только для чтения (`:ro`)
- Скрипты имеют минимальные необходимые права

