#!/bin/sh

# Скрипт для автоматического обновления SSL сертификатов
# Выполняется внутри контейнера certbot
# После успешного обновления перезагружает Nginx

echo "$(date): Проверка обновления SSL сертификатов..."

# Обновляем сертификаты с post-renew hook
# Hook будет вызван только если сертификаты действительно обновлены
certbot renew \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --post-hook "/reload-nginx.sh" \
  --quiet

echo "$(date): Проверка завершена"

