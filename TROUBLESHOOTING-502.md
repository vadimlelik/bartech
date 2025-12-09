# Troubleshooting 502 Bad Gateway

## Проблема
После CI/CD деплоя сайт показывает ошибку 502 Bad Gateway, хотя при начальном подъеме все работает.

## Причины 502 Bad Gateway

502 Bad Gateway означает, что Nginx не может подключиться к Next.js приложению. Возможные причины:

1. **Next.js контейнер не запустился или упал**
2. **Next.js контейнер еще не готов** (приложение еще запускается)
3. **Проблемы с сетью Docker** (контейнеры не в одной сети)
4. **Отсутствуют переменные окружения** (приложение не может запуститься)
5. **Образ не был загружен** из Docker Hub

## Диагностика на сервере

### 1. Проверка статуса контейнеров

```bash
cd /opt/bartech
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

**Ожидаемый результат:**
- Все контейнеры должны быть в статусе `Up` или `Up (healthy)`
- Если контейнер `nextjs` показывает `Exit` или `Restarting` - проблема в нем

### 2. Проверка логов Next.js

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nextjs --tail=100
```

**Что искать:**
- Ошибки запуска приложения
- Отсутствующие переменные окружения
- Ошибки подключения к Supabase
- Ошибки сборки

### 3. Проверка логов Nginx

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx --tail=50
```

**Что искать:**
- `connect() failed (111: Connection refused)` - Next.js не отвечает
- `upstream timed out` - Next.js не успевает ответить

### 4. Проверка переменных окружения

```bash
cd /opt/bartech

# Проверка наличия .env файла
ls -la .env

# Проверка содержимого (НЕ показывайте токены!)
cat .env | grep -E "DOCKERHUB_USERNAME|NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

**Обязательные переменные:**
- `DOCKERHUB_USERNAME` - для загрузки образа
- `NEXT_PUBLIC_SUPABASE_URL` - для работы приложения
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - для работы приложения
- `SUPABASE_SERVICE_ROLE_KEY` - для административных операций

### 5. Проверка образа Docker

```bash
# Проверка загруженных образов
docker images | grep bartech

# Проверка, что образ latest существует
docker images | grep "yourusername/bartech.*latest"
```

### 6. Проверка сети Docker

```bash
# Проверка сетей
docker network ls | grep app-network

# Проверка подключения контейнеров к сети
docker network inspect app-network
```

### 7. Проверка health check Next.js

```bash
# Проверка health check изнутри контейнера
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nextjs node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => {console.log('Status:', r.statusCode); process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### 8. Проверка подключения Nginx к Next.js

```bash
# Проверка из контейнера Nginx
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx wget -O- http://nextjs:3000/api/health
```

## Решения

### Решение 1: Перезапуск контейнеров

```bash
cd /opt/bartech

# Остановка
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Запуск
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Ожидание запуска
sleep 10

# Проверка статуса
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### Решение 2: Обновление образа

```bash
cd /opt/bartech

# Обновление образа
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Перезапуск
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Решение 3: Проверка и исправление .env файла

```bash
cd /opt/bartech

# Создать .env файл, если его нет
nano .env
```

Добавьте обязательные переменные:
```env
DOCKERHUB_USERNAME=your_dockerhub_username
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

После изменения перезапустите:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Решение 4: Пересоздание контейнеров

```bash
cd /opt/bartech

# Остановка и удаление контейнеров
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Удаление образа (опционально)
docker rmi yourusername/bartech:latest

# Загрузка нового образа
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Запуск
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Решение 5: Проверка volumes

```bash
# Проверка volumes
docker volume ls | grep certbot

# Если volumes отсутствуют, создайте их
docker volume create technobar_certbot-etc
docker volume create technobar_certbot-var
```

## Автоматическая диагностика

Выполните на сервере для полной диагностики:

```bash
cd /opt/bartech

echo "=== Container Status ==="
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo "=== Next.js Logs (last 50 lines) ==="
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nextjs --tail=50

echo "=== Nginx Logs (last 50 lines) ==="
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx --tail=50

echo "=== Docker Images ==="
docker images | grep bartech

echo "=== Environment Variables Check ==="
if [ -f .env ]; then
  echo ".env file exists"
  grep -q "DOCKERHUB_USERNAME" .env && echo "✓ DOCKERHUB_USERNAME set" || echo "✗ DOCKERHUB_USERNAME missing"
  grep -q "NEXT_PUBLIC_SUPABASE_URL" .env && echo "✓ NEXT_PUBLIC_SUPABASE_URL set" || echo "✗ NEXT_PUBLIC_SUPABASE_URL missing"
  grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env && echo "✓ NEXT_PUBLIC_SUPABASE_ANON_KEY set" || echo "✗ NEXT_PUBLIC_SUPABASE_ANON_KEY missing"
else
  echo "✗ .env file not found!"
fi

echo "=== Network Check ==="
docker network inspect app-network 2>/dev/null | grep -A 5 "Containers" || echo "Network app-network not found"

echo "=== Health Check ==="
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec -T nextjs node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => {console.log('Status:', r.statusCode); process.exit(r.statusCode === 200 ? 0 : 1)})" 2>&1 && echo "✓ Next.js health check passed" || echo "✗ Next.js health check failed"
```

## Что было исправлено в deploy.yml

1. ✅ Добавлена проверка наличия .env файла
2. ✅ Добавлена проверка переменных окружения
3. ✅ Добавлена проверка загрузки образа
4. ✅ Добавлено ожидание готовности Next.js перед reload Nginx
5. ✅ Увеличено время ожидания перед health check
6. ✅ Добавлен вывод логов при ошибке health check
7. ✅ Добавлена проверка статуса контейнеров

## Предотвращение проблемы

1. **Убедитесь, что .env файл существует на сервере** с правильными переменными
2. **Проверьте, что образ был успешно собран и загружен в Docker Hub**
3. **Убедитесь, что все volumes созданы** (`technobar_certbot-etc`, `technobar_certbot-var`)
4. **Проверьте логи после деплоя** в GitHub Actions

## Полезные команды

```bash
# Быстрый перезапуск
cd /opt/bartech && docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart

# Просмотр логов в реальном времени
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Проверка использования ресурсов
docker stats

# Очистка неиспользуемых ресурсов
docker system prune -f
```
