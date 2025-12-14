# 🚀 Полный процесс сборки и деплоя проекта Bartech

## 📋 Обзор архитектуры

Проект использует:
- **Next.js 15** (React 18) - фронтенд/бэкенд фреймворк
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация контейнеров
- **GitHub Actions** - CI/CD автоматизация
- **Nginx** - reverse proxy и SSL терминация
- **Certbot** - автоматическое обновление SSL сертификатов

---

## 🏗️ Этап 1: Сборка Docker образа

### 1.1 Multi-stage Dockerfile

Dockerfile использует **multi-stage build** для оптимизации размера:

#### Stage 1: `base` (Node.js 20 Alpine)
```dockerfile
FROM node:20-alpine AS base
```
- Базовый образ с Node.js 20
- Alpine Linux для минимального размера

#### Stage 2: `builder` (Сборка приложения)
```dockerfile
FROM base AS builder
WORKDIR /app
```

**Процесс сборки:**
1. **Копирование зависимостей:**
   ```dockerfile
   COPY package.json package-lock.json ./
   RUN npm ci  # Установка зависимостей (чистая установка)
   ```

2. **Копирование исходного кода:**
   ```dockerfile
   COPY . .
   ```

3. **Очистка кеша Next.js:**
   ```dockerfile
   RUN rm -rf .next || true
   ```

4. **Настройка памяти для сборки:**
   ```dockerfile
   ENV NODE_OPTIONS="--max_old_space_size=4096"
   ```

5. **Сборка Next.js:**
   ```dockerfile
   RUN npm run build
   ```
   - Выполняет `next build` из package.json
   - Создает оптимизированную production сборку
   - Генерирует `.next/standalone` (благодаря `output: 'standalone'` в next.config.mjs)

#### Stage 3: `runner` (Production образ)
```dockerfile
FROM base AS runner
WORKDIR /app
```

**Оптимизация:**
- Копируются только необходимые файлы:
  - `public/` - статические файлы
  - `.next/standalone/` - standalone сервер Next.js
  - `.next/static/` - статические ресурсы
  - `data/` - JSON файлы для fallback данных

- Создается непривилегированный пользователь:
  ```dockerfile
  RUN adduser --system --uid 1001 nextjs
  USER nextjs
  ```

- Запускается standalone сервер:
  ```dockerfile
  CMD ["node", "server.js"]
  ```

### 1.2 Build Arguments

При сборке передаются переменные окружения:
```dockerfile
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}
```

---

## 🔄 Этап 2: CI/CD Pipeline (GitHub Actions)

### 2.1 Триггеры

Workflow запускается при:
- Push в ветки `main` или `master`
- Push тегов `v*` (версии)
- Pull Request в `main` или `master`

### 2.2 Job: `build-and-push`

#### Шаг 1: Checkout кода
```yaml
- uses: actions/checkout@v4
```

#### Шаг 2: Настройка Docker Buildx
```yaml
- uses: docker/setup-buildx-action@v3
```
- Поддержка multi-platform сборки
- Оптимизация кеша

#### Шаг 3: Авторизация в Docker Hub
```yaml
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

#### Шаг 4: Генерация тегов
```yaml
- uses: docker/metadata-action@v5
```
Создаются теги:
- `latest` - для основной ветки
- `sha-<commit-hash>` - для конкретного коммита
- `v1.2.3` - для версионных тегов

#### Шаг 5: Сборка и push образа
```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    file: ./Dockerfile
    build-args: |
      NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    platforms: linux/amd64
```

**Результат:** Образ загружается в Docker Hub как `{username}/bartech:latest`

---

## 🚀 Этап 3: Деплой на сервер

### 3.1 Job: `deploy`

#### Шаг 1: SSH подключение
```yaml
- uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
```

#### Шаг 2: Деплой на сервер

Выполняется SSH команда на сервере `/opt/bartech`:

**3.2.1 Проверка окружения:**
```bash
# Проверка .env файла
if [ ! -f .env ]; then
  echo "ERROR: .env file not found!"
  exit 1
fi
```

**3.2.2 Создание Docker volumes:**
```bash
# Volumes для SSL сертификатов
docker volume create technobar_certbot-etc
docker volume create technobar_certbot-var
```

**3.2.3 Загрузка переменных из .env:**
```bash
set -a
while IFS= read -r line; do
  # Парсинг и экспорт переменных
done < .env
set +a
```

**3.2.4 Очистка старых образов:**
```bash
# Удаление всех старых образов bartech
docker images ${DOCKERHUB_USERNAME}/bartech --format "{{.ID}}" | xargs -r docker rmi -f
docker builder prune -f  # Очистка build cache
```

**3.2.5 Pull нового образа:**
```bash
# Принудительный pull без кеша
docker pull ${DOCKERHUB_USERNAME}/bartech:latest --no-cache
```

**3.2.6 Остановка старых контейнеров:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans
docker rm -f bartech-nextjs bartech-nginx bartech-certbot
```

**3.2.7 Запуск новых контейнеров:**
```bash
# Запуск Next.js с принудительным пересозданием
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d \
  --force-recreate --no-deps --remove-orphans nextjs

# Запуск зависимых сервисов
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx certbot
```

**3.2.8 Health check:**
```bash
# Ожидание готовности Next.js (до 30 попыток)
max_attempts=30
while [ $attempt -lt $max_attempts ]; do
  if docker-compose exec -T nextjs wget --spider http://127.0.0.1:3000/api/health; then
    echo "Next.js is ready!"
    break
  fi
  sleep 2
done
```

**3.2.9 Перезагрузка Nginx:**
```bash
docker-compose exec -T nginx nginx -s reload
```

---

## 🐳 Этап 4: Запуск контейнеров

### 4.1 Docker Compose структура

#### `docker-compose.yml` (базовая конфигурация)
- Определяет все сервисы
- Используется для локальной разработки
- Содержит секцию `build` для локальной сборки

#### `docker-compose.prod.yml` (production override)
- Переопределяет сервис `nextjs`:
  - Использует готовый образ из Docker Hub: `${DOCKERHUB_USERNAME}/bartech:latest`
  - `pull_policy: always` - всегда тянет последнюю версию
- Устанавливает `restart: always` для всех сервисов

### 4.2 Сервисы

#### 4.2.1 Next.js (`bartech-nextjs`)
```yaml
services:
  nextjs:
    image: ${DOCKERHUB_USERNAME}/bartech:latest
    container_name: bartech-nextjs
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Особенности:**
- Порт: `3000` (внутренний)
- Health check каждые 30 секунд
- Автоматический перезапуск при падении

#### 4.2.2 Nginx (`bartech-nginx`)
```yaml
services:
  nginx:
    image: nginx:stable-alpine
    container_name: bartech-nginx
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - technobar_certbot-etc:/etc/letsencrypt:ro
    depends_on:
      - nextjs
```

**Функции:**
- Reverse proxy для Next.js
- SSL терминация (HTTPS)
- Статические файлы
- Автоматическая перезагрузка каждые 6 часов

#### 4.2.3 Certbot (`bartech-certbot`)
```yaml
services:
  certbot:
    image: certbot/dns-cloudflare:latest
    container_name: bartech-certbot
    volumes:
      - technobar_certbot-etc:/etc/letsencrypt
      - technobar_certbot-var:/var/lib/letsencrypt
      - ./certbot/cloudflare.ini:/cloudflare.ini:ro
    entrypoint: "/bin/sh -c 'while :; do /auto-renew-certs.sh; sleep 12h; done'"
```

**Функции:**
- Автоматическое обновление SSL сертификатов каждые 12 часов
- Использует Cloudflare DNS для wildcard сертификатов
- Автоматическая перезагрузка Nginx после обновления

### 4.3 Сеть

Все сервисы подключены к одной сети:
```yaml
networks:
  app-network:
    driver: bridge
```

---

## 📝 Команды Makefile

### Локальная разработка
```bash
make build          # Собрать образы локально
make up             # Запустить все сервисы
make down           # Остановить все сервисы
make logs           # Показать логи
```

### Production деплой
```bash
make prod-up        # Запустить в production режиме
make prod-down      # Остановить production
make force-update   # Принудительно обновить из Docker Hub
```

### Очистка и пересборка
```bash
make clean-rebuild  # Полная очистка и пересборка без кеша
make rebuild-local  # Локальная пересборка образа
make clean          # Очистить неиспользуемые Docker ресурсы
```

### SSL сертификаты
```bash
make init-certs     # Инициализировать SSL сертификаты
make renew-certs    # Обновить сертификаты вручную
make cleanup-certs  # Удалить старые сертификаты
```

---

## 🔍 Процесс сборки Next.js

### 1. `npm run build` → `next build`

**Что происходит:**
1. **Компиляция TypeScript/JavaScript:**
   - Транспиляция в оптимизированный код
   - Tree-shaking (удаление неиспользуемого кода)

2. **Оптимизация React:**
   - Минификация компонентов
   - Оптимизация импортов

3. **Генерация статических страниц:**
   - Pre-rendering статических страниц
   - Генерация HTML для SSG

4. **Создание standalone сборки:**
   - Благодаря `output: 'standalone'` в next.config.mjs
   - Создается `.next/standalone/` с минимальными зависимостями
   - Включает только необходимые node_modules

5. **Оптимизация изображений:**
   - Генерация разных размеров
   - WebP конвертация

6. **Создание манифестов:**
   - Route manifest
   - Build manifest
   - Prerender manifest

### 2. Результат сборки

```
.next/
├── standalone/          # Минимальный сервер для Docker
│   ├── server.js        # Точка входа
│   ├── node_modules/    # Только необходимые зависимости
│   └── ...
├── static/              # Статические ресурсы
│   ├── chunks/          # JS chunks
│   └── ...
└── cache/               # Build cache
```

---

## 🔐 Переменные окружения

### Необходимые переменные в `.env`:

```bash
# Docker Hub
DOCKERHUB_USERNAME=yourusername

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### GitHub Secrets:

```yaml
DOCKERHUB_USERNAME: username
DOCKERHUB_TOKEN: token
NEXT_PUBLIC_SUPABASE_URL: https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: xxx
SSH_USER: root
SSH_PRIVATE_KEY: private_key
SERVER_HOST: your-server.com
```

---

## 🎯 Полный цикл деплоя

```
1. Разработчик пушит код в main/master
   ↓
2. GitHub Actions запускает workflow
   ↓
3. Сборка Docker образа с build args
   ↓
4. Push образа в Docker Hub
   ↓
5. SSH подключение к серверу
   ↓
6. Остановка старых контейнеров
   ↓
7. Pull нового образа из Docker Hub
   ↓
8. Запуск новых контейнеров
   ↓
9. Health check Next.js
   ↓
10. Перезагрузка Nginx
    ↓
11. Проверка работоспособности
    ↓
12. ✅ Деплой завершен
```

---

## 🛠️ Ручной деплой (без CI/CD)

Если нужно задеплоить вручную:

```bash
# На сервере
cd /opt/bartech

# Вариант 1: Использовать готовый образ из Docker Hub
make force-update

# Вариант 2: Локальная пересборка
make rebuild-local

# Вариант 3: Полная очистка и пересборка
make clean-rebuild
```

---

## 📊 Мониторинг

### Проверка статуса контейнеров:
```bash
make status
# или
docker-compose ps
```

### Просмотр логов:
```bash
make logs              # Все сервисы
make logs-nextjs       # Только Next.js
make logs-nginx        # Только Nginx
make logs-certbot      # Только Certbot
```

### Health check:
```bash
make health
# Проверяет https://technobar.by/api/health
```

---

## 🔧 Troubleshooting

### Проблема: "no space left on device"
```bash
make clean-rebuild  # Полная очистка и пересборка
```

### Проблема: Старый код в контейнере
```bash
# Удалить образ и пересобрать
docker rmi ${DOCKERHUB_USERNAME}/bartech:latest
make force-update
```

### Проблема: Next.js не запускается
```bash
# Проверить логи
make logs-nextjs

# Проверить переменные окружения
docker-compose exec nextjs env | grep NEXT_PUBLIC
```

### Проблема: SSL сертификаты не обновляются
```bash
# Обновить вручную
make renew-certs
```

---

## 📚 Дополнительные ресурсы

- [Next.js Standalone Output](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose Override](https://docs.docker.com/compose/extends/)
