#!/bin/sh

# Скрипт для ручного обновления сертификатов
# Обычно это делается автоматически через docker-compose

echo "Обновление SSL сертификатов..."

docker-compose exec certbot certbot renew --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini

echo "Перезагрузка Nginx..."
docker-compose exec nginx nginx -s reload

echo "Сертификаты обновлены!"

