# CI/CD Setup для Bartech

Этот проект настроен для автоматической сборки и развертывания через GitHub Actions и Docker Hub.

## Быстрый старт

### 1. Настройка Docker Hub

1. Создайте аккаунт на [Docker Hub](https://hub.docker.com)
2. Создайте Access Token:
   - Перейдите в Settings → Security → New Access Token
   - Сохраните токен в безопасном месте

### 2. Настройка GitHub Secrets

В настройках репозитория (Settings → Secrets and variables → Actions) добавьте:

**Обязательные для сборки Docker образа:**
- `DOCKERHUB_USERNAME` - ваш Docker Hub username
- `DOCKERHUB_TOKEN` - ваш Docker Hub access token
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта (требуется на этапе сборки!)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - анонимный ключ Supabase (требуется на этапе сборки!)

**Для автоматического деплоя (опционально):**
- `SSH_PRIVATE_KEY` - приватный SSH ключ для сервера
- `SSH_USER` - пользователь для SSH (обычно `root` или `ubuntu`)
- `SERVER_HOST` - IP адрес или домен вашего сервера

**Важно:** `NEXT_PUBLIC_*` переменные должны быть в GitHub Secrets, так как они встраиваются в клиентский JavaScript bundle во время сборки Docker образа.

### 3. Настройка сервера

На сервере выполните:

```bash
# Клонируйте репозиторий
git clone <your-repo-url> /path/to/app
cd /path/to/app

# Создайте .env файл
cp .env.example .env
# Отредактируйте .env и добавьте ваши переменные

# Настройте Cloudflare API токен
cp certbot/cloudflare.ini.example certbot/cloudflare.ini
# Отредактируйте certbot/cloudflare.ini

# Получите SSL сертификаты (первый раз)
make init-certs
# или
./scripts/init-certbot.sh

# Запустите приложение
make prod-up
# или
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Автоматическое развертывание

После настройки, при каждом push в ветку `main` или `master`:

1. ✅ GitHub Actions соберет Docker образ
2. ✅ Образ будет загружен в Docker Hub
3. ✅ На сервере автоматически обновится приложение (если настроен deploy workflow)

## Workflow файлы

### `.github/workflows/docker-build-push.yml`

Автоматически собирает и публикует Docker образ при:
- Push в `main` или `master`
- Создании тега `v*`
- Pull Request (только сборка, без публикации)

### `.github/workflows/deploy.yml`

Автоматически развертывает приложение на сервере после успешной сборки.

**Требования:**
- Настроенные SSH ключи
- Docker и Docker Compose на сервере
- Правильный путь к приложению в скрипте деплоя

## Ручное развертывание

Если автоматический деплой не настроен:

```bash
# На сервере
cd /path/to/app
git pull
docker-compose pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Полезные команды

```bash
# Просмотр логов
make logs

# Проверка статуса
make status

# Обновление сертификатов
make renew-certs

# Проверка здоровья
make health

# Очистка
make clean
```

## Структура проекта

```
.
├── .github/
│   └── workflows/
│       ├── docker-build-push.yml  # CI для сборки и публикации
│       └── deploy.yml            # CD для развертывания
├── certbot/
│   ├── cloudflare.ini.example    # Пример конфигурации
│   └── cloudflare.ini            # Ваш API токен (не в Git!)
├── nginx/
│   └── nginx.conf                # Конфигурация Nginx
├── scripts/
│   ├── init-certbot.sh          # Инициализация сертификатов
│   └── renew-cert.sh            # Обновление сертификатов
├── Dockerfile                    # Docker образ приложения
├── docker-compose.yml            # Основная конфигурация
├── docker-compose.prod.yml       # Production override
├── Makefile                      # Удобные команды
└── DEPLOYMENT.md                 # Подробная документация
```

## Поддомены

Все поддомены из `src/middleware.js` автоматически поддерживаются:
- SSL сертификаты выдаются для всех поддоменов
- Nginx проксирует все поддомены на Next.js
- Next.js middleware обрабатывает маршрутизацию

## Мониторинг

- Health check: `https://cvirko-vadim.ru/api/health`
- Логи: `docker-compose logs -f`
- Статус: `docker-compose ps`

## Troubleshooting

### Проблемы с CI/CD

1. Проверьте GitHub Actions logs
2. Убедитесь, что все secrets настроены
3. Проверьте права доступа к Docker Hub

### Проблемы с сертификатами

```bash
# Проверка сертификатов
docker-compose exec certbot certbot certificates

# Тестовое обновление
docker-compose exec certbot certbot renew --dry-run
```

### Проблемы с деплоем

1. Проверьте SSH подключение
2. Убедитесь, что Docker установлен на сервере
3. Проверьте путь к приложению в deploy.yml

## Безопасность

- ✅ Не коммитьте `.env` файлы
- ✅ Не коммитьте `certbot/cloudflare.ini`
- ✅ Используйте сильные пароли
- ✅ Регулярно обновляйте зависимости
- ✅ Мониторьте логи на подозрительную активность

