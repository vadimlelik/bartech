#!/bin/sh

# Скрипт для перезагрузки Nginx после обновления сертификатов
# Вызывается как post-renew hook от certbot

echo "$(date): Сертификаты обновлены. Перезагрузка Nginx..."

# Устанавливаем docker-cli если его нет
if ! command -v docker >/dev/null 2>&1; then
  echo "$(date): Установка Docker CLI..."
  apk add --no-cache docker-cli >/dev/null 2>&1 || {
    echo "$(date): ⚠️  Не удалось установить Docker CLI"
    echo "$(date): Выполните вручную на хосте: docker exec bartech-nginx nginx -s reload"
    exit 1
  }
fi

# Проверяем доступность docker socket
if [ ! -S /var/run/docker.sock ]; then
  echo "$(date): ⚠️  Docker socket не найден"
  echo "$(date): Выполните вручную на хосте: docker exec bartech-nginx nginx -s reload"
  exit 1
fi

# Используем docker exec для перезагрузки nginx
if docker exec bartech-nginx nginx -s reload 2>/dev/null; then
  echo "$(date): ✅ Nginx успешно перезагружен"
  exit 0
else
  echo "$(date): ⚠️  Не удалось перезагрузить Nginx через docker exec"
  echo "$(date): Выполните вручную на хосте: docker exec bartech-nginx nginx -s reload"
  echo "$(date): Или перезапустите контейнер nginx: docker restart bartech-nginx"
  exit 1
fi

