# Изменения для CI/CD Setup

## Созданные файлы

### Docker и контейнеризация
- ✅ `Dockerfile` - оптимизированный multi-stage build для Next.js
- ✅ `docker-compose.yml` - основная конфигурация с Next.js, Nginx и CertBot
- ✅ `docker-compose.prod.yml` - production override для использования образов из Docker Hub
- ✅ `.dockerignore` - исключение ненужных файлов из Docker образа

### Nginx конфигурация
- ✅ `nginx/nginx.conf` - обновленная конфигурация с поддержкой всех поддоменов и SSL

### CertBot и SSL
- ✅ `certbot/cloudflare.ini.example` - пример конфигурации Cloudflare API
- ✅ `scripts/init-certbot.sh` - скрипт для первоначального получения сертификатов
- ✅ `scripts/renew-cert.sh` - скрипт для ручного обновления сертификатов

### CI/CD
- ✅ `.github/workflows/docker-build-push.yml` - автоматическая сборка и публикация в Docker Hub
- ✅ `.github/workflows/deploy.yml` - автоматическое развертывание на сервер

### Документация
- ✅ `DEPLOYMENT.md` - подробная инструкция по развертыванию
- ✅ `README-CICD.md` - документация по CI/CD
- ✅ `QUICKSTART.md` - быстрый старт
- ✅ `CHANGES.md` - этот файл

### Утилиты
- ✅ `Makefile` - удобные команды для управления
- ✅ `src/app/api/health/route.js` - health check endpoint
- ✅ `.gitattributes` - настройка line endings

## Обновленные файлы

- ✅ `next.config.js` - добавлен `output: 'standalone'` для Docker оптимизации
- ✅ `.gitignore` - добавлены исключения для certbot и чувствительных файлов

## Настройки поддоменов

Все поддомены из `src/middleware.js` поддерживаются:
- phone2.technobar.by
- tv1.technobar.by
- 1phonefree.technobar.by
- 50discount.technobar.by
- phone.technobar.by
- phone3.technobar.by
- phone4.technobar.by
- phone5.technobar.by
- phone6.technobar.by
- shockproof_phone.technobar.by
- laptop.technobar.by
- bicycles.technobar.by
- motoblok.technobar.by
- pc.technobar.by
- scooter.technobar.by
- laptop_2.technobar.by
- tv2.technobar.by
- tv3.technobar.by
- motoblok_1.technobar.by
- motoblok_2.technobar.by

## Что нужно сделать

### 1. На сервере
- [ ] Установить Docker и Docker Compose
- [ ] Клонировать репозиторий
- [ ] Создать `.env` файл с переменными окружения
- [ ] Создать `certbot/cloudflare.ini` с API токеном
- [ ] Получить SSL сертификаты (`make init-certs`)
- [ ] Запустить приложение (`make prod-up`)

### 2. В GitHub
- [ ] Добавить secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- [ ] (Опционально) Добавить secrets для автоматического деплоя: `SSH_PRIVATE_KEY`, `SSH_USER`, `SERVER_HOST`
- [ ] Обновить путь в `.github/workflows/deploy.yml` (заменить `/path/to/your/app`)

### 3. В Docker Hub
- [ ] Создать репозиторий `bartech`
- [ ] Создать Access Token

## Автоматизация

После настройки:
- ✅ При каждом push в `main`/`master` автоматически собирается Docker образ
- ✅ Образ публикуется в Docker Hub
- ✅ SSL сертификаты обновляются автоматически каждые 12 часов
- ✅ Nginx перезагружается каждые 6 часов
- ✅ (Опционально) Автоматическое развертывание на сервер

## Безопасность

- ✅ `.env` файлы исключены из Git
- ✅ `certbot/cloudflare.ini` исключен из Git
- ✅ SSL сертификаты хранятся в Docker volumes
- ✅ Используются security headers в Nginx

## Следующие шаги

1. Прочитайте `QUICKSTART.md` для быстрого старта
2. Следуйте инструкциям в `DEPLOYMENT.md` для детальной настройки
3. Используйте `Makefile` для управления приложением

