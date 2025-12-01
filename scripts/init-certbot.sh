#!/bin/sh

# Скрипт для первоначального получения сертификатов
# Использование: ./scripts/init-certbot.sh

DOMAIN="cvirko-vadim.ru"
SUBDOMAINS="phone2.cvirko-vadim.ru,tv1.cvirko-vadim.ru,1phonefree.cvirko-vadim.ru,50discount.cvirko-vadim.ru,phone.cvirko-vadim.ru,phone3.cvirko-vadim.ru,phone4.cvirko-vadim.ru,phone5.cvirko-vadim.ru,phone6.cvirko-vadim.ru,shockproof_phone.cvirko-vadim.ru,laptop.cvirko-vadim.ru,bicycles.cvirko-vadim.ru,motoblok.cvirko-vadim.ru,pc.cvirko-vadim.ru,scooter.cvirko-vadim.ru,laptop_2.cvirko-vadim.ru,tv2.cvirko-vadim.ru,tv3.cvirko-vadim.ru,motoblok_1.cvirko-vadim.ru,motoblok_2.cvirko-vadim.ru"

echo "Инициализация CertBot для домена $DOMAIN и поддоменов..."

docker run --rm \
  -v certbot-etc:/etc/letsencrypt \
  -v certbot-var:/var/lib/letsencrypt \
  -v $(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
  certbot/certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --dns-cloudflare-propagation-seconds 60 \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "$SUBDOMAINS"

echo "Сертификаты получены! Теперь можно запустить docker-compose up -d"

