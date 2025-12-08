#!/bin/sh

# Скрипт для очистки старых сертификатов перед пересозданием
# Использование: ./scripts/cleanup-old-certs.sh

echo "⚠️  ВНИМАНИЕ: Этот скрипт удалит все существующие сертификаты для technobar.by"
echo "Вы будете пересоздавать сертификаты после очистки"
read -p "Продолжить? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Отменено."
    exit 0
fi

echo "Остановка контейнеров..."
docker-compose down

echo "Удаление старых сертификатов из volume..."
docker run --rm \
  -v cvirko-vadim_certbot-etc:/etc/letsencrypt \
  -v cvirko-vadim_certbot-var:/var/lib/letsencrypt \
  alpine:latest \
  sh -c "rm -rf /etc/letsencrypt/live/technobar.by* /etc/letsencrypt/renewal/technobar.by* /etc/letsencrypt/archive/technobar.by*"

echo "✅ Старые сертификаты удалены"
echo ""
echo "Теперь вы можете создать новые сертификаты:"
echo "  make init-certs"
echo ""
echo "Или вручную:"
echo "  docker run --rm -it \\"
echo "    -v cvirko-vadim_certbot-etc:/etc/letsencrypt \\"
echo "    -v cvirko-vadim_certbot-var:/var/lib/letsencrypt \\"
echo "    -v \$(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \\"
echo "    certbot/dns-cloudflare certonly \\"
echo "    --non-interactive \\"
echo "    --dns-cloudflare \\"
echo "    --dns-cloudflare-credentials /cloudflare.ini \\"
echo "    --dns-cloudflare-propagation-seconds 60 \\"
echo "    --email your-email@example.com \\"
echo "    --agree-tos \\"
echo "    --no-eff-email \\"
echo "    -d technobar.by \\"
echo "    -d \"*.technobar.by\""

