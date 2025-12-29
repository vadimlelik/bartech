#!/bin/sh

# Скрипт для перезагрузки Nginx после обновления сертификатов
# Вызывается как post-renew hook от certbot

echo "$(date): Сертификаты обновлены. Перезагрузка Nginx..."

# Используем docker exec для перезагрузки nginx
# Docker CLI должен быть установлен в entrypoint контейнера
if command -v docker >/dev/null 2>&1; then
  if docker exec bartech-nginx nginx -s reload 2>/dev/null; then
    echo "$(date): ✅ Nginx успешно перезагружен"
    exit 0
  else
    echo "$(date): ⚠️  Не удалось перезагрузить Nginx через docker exec"
  fi
else
  echo "$(date): ⚠️  Docker CLI не найден в контейнере"
fi

# Если docker exec не сработал, выводим предупреждение
echo "$(date): ⚠️  Предупреждение: автоматическая перезагрузка Nginx не удалась"
echo "$(date): Выполните вручную на хосте: docker exec bartech-nginx nginx -s reload"
echo "$(date): Или перезапустите контейнер nginx: docker restart bartech-nginx"

