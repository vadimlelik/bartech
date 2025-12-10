#!/bin/sh

# Скрипт для перезагрузки Nginx после обновления сертификатов
# Вызывается как post-renew hook от certbot

echo "$(date): Сертификаты обновлены. Перезагрузка Nginx..."

# Используем docker exec для перезагрузки nginx
# Контейнер nginx должен быть доступен через docker network
docker exec bartech-nginx nginx -s reload 2>/dev/null || {
  echo "$(date): Предупреждение: не удалось перезагрузить Nginx автоматически"
  echo "$(date): Выполните вручную: docker exec bartech-nginx nginx -s reload"
}

echo "$(date): Nginx перезагружен"

