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
- phone2.cvirko-vadim.ru
- tv1.cvirko-vadim.ru
- 1phonefree.cvirko-vadim.ru
- 50discount.cvirko-vadim.ru
- phone.cvirko-vadim.ru
- phone3.cvirko-vadim.ru
- phone4.cvirko-vadim.ru
- phone5.cvirko-vadim.ru
- phone6.cvirko-vadim.ru
- shockproof_phone.cvirko-vadim.ru
- laptop.cvirko-vadim.ru
- bicycles.cvirko-vadim.ru
- motoblok.cvirko-vadim.ru
- pc.cvirko-vadim.ru
- scooter.cvirko-vadim.ru
- laptop_2.cvirko-vadim.ru
- tv2.cvirko-vadim.ru
- tv3.cvirko-vadim.ru
- motoblok_1.cvirko-vadim.ru
- motoblok_2.cvirko-vadim.ru

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

