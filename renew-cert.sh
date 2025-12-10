#!/bin/sh

# Скрипт для ручного обновления SSL сертификатов
# Автоматическое обновление настроено в docker-compose.yml

echo "Обновление SSL сертификатов..."

docker-compose exec certbot certbot renew \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --post-hook "/reload-nginx.sh"

echo "Сертификаты обновлены!"