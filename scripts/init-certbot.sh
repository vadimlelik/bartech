#!/bin/sh

# Скрипт для первоначального получения wildcard сертификатов
# Использование: ./scripts/init-certbot.sh
# Сертификат будет работать для technobar.by и всех поддоменов *.technobar.by

DOMAIN="technobar.by"
WILDCARD="*.technobar.by"

echo "Инициализация CertBot для wildcard сертификата..."
echo "Домен: $DOMAIN"
echo "Wildcard: $WILDCARD"
echo "Этот сертификат будет работать для основного домена и всех поддоменов"

read -p "Введите ваш email: " email

docker run --rm -it \
  -v technobar_certbot-etc:/etc/letsencrypt \
  -v technobar_certbot-var:/var/lib/letsencrypt \
  -v $(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
  certbot/dns-cloudflare certonly \
  --non-interactive \
  --force-renewal \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --dns-cloudflare-propagation-seconds 60 \
  --email "$email" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "$WILDCARD"

echo "Wildcard сертификаты получены! Теперь можно запустить docker-compose up -d"
echo "Вы можете создавать новые поддомены без перевыпуска сертификатов."

