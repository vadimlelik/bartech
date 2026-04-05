# Деплой и CI/CD (Bartech)

Полная схема: **Next.js** в Docker → **Docker Hub** → **сервер** (`/opt/bartech`) через **GitHub Actions** и SSH. Рядом в compose: **PostgreSQL**, **MinIO**, **Nginx**, **Certbot** (Cloudflare DNS).

---

## 1. Архитектура

| Компонент | Назначение |
|-----------|------------|
| `Dockerfile` | Multi-stage: `npm ci` → `prisma generate` → `next build` → образ на `node:20-alpine` с `output: 'standalone'` |
| `docker-compose.yml` | Базовый стек: nextjs, nginx, minio, postgres, certbot |
| `docker-compose.prod.yml` | Подмена сервиса `nextjs` на образ `${DOCKERHUB_USERNAME}/bartech:latest`; переменные подставляются из `/opt/bartech/.env` (файл перезаписывается при каждом деплое из **GitHub Actions secrets**) |
| GitHub Actions | Сборка и пуш образа; деплой по SSH на сервер |

**Важно:** в CI сейчас триггеры на ветки `main` и `master`. Если основная ветка называется иначе (например `baratex`), либо мержите в `main`/`master`, либо добавьте ветку в `.github/workflows/docker-build-push.yml` в списки `branches:`.

---

## 2. Требования к серверу

- Ubuntu/Debian (или другой Linux с Docker).
- Установлены **Docker** и **Docker Compose v2** (`docker compose` или `docker-compose`).
- Открыты порты **80**, **443** (и при необходимости 22 для SSH).
- Каталог **`/opt/bartech`** с файлами проекта для продакшена (см. ниже).
- Внешние Docker volumes **`technobar_certbot-etc`** и **`technobar_certbot-var`** (создаются скриптом деплоя или вручную: `docker volume create technobar_certbot-etc` и т.д.).

---

## 3. Первичная настройка сервера

### 3.1. Клонирование / копирование файлов

На сервере в `/opt/bartech` должны лежать как минимум:

- `docker-compose.yml`
- `docker-compose.prod.yml`
- `nginx/nginx.conf` (и связанные конфиги, если есть)
- `certbot/cloudflare.ini` (токен Cloudflare для DNS-валидации Let’s Encrypt)
- `scripts/` (скрипты для certbot, если используются в compose)

**`.env` на сервере** не нужно создавать вручную для CI-деплоя: workflow заливает его по SSH из секретов GitHub перед `docker pull`. Для **первого ручного** запуска без Actions можно один раз положить `.env` локально на сервере или скопировать значения из секретов.

Образ приложения **не обязан** собираться на сервере: подтягивается с Docker Hub.

### 3.2. Файл `certbot/cloudflare.ini`

Формат для Certbot DNS Cloudflare:

```ini
dns_cloudflare_api_token = ВАШ_API_TOKEN
```

Токен в Cloudflare: разрешения на **DNS:Edit** для зоны домена.

### 3.3. Секреты и `.env` на сервере

Продакшен-значения задаются в **GitHub → Settings → Secrets and variables → Actions** (см. раздел 4). При деплое Actions формирует `/opt/bartech/.env` на сервере; в репозитории и вручную на диске сервера хранить пароли не обязательно.

Содержимое `.env` по смыслу такое же, как раньше: `DOCKERHUB_USERNAME`, `AUTH_SECRET` (≥ 32 символов), `DATABASE_URL`, `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` (должны согласовываться с `DATABASE_URL`), `MINIO_*` для приложения и контейнера MinIO. Опционально в секретах можно не задавать `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USE_SSL`, `MINIO_BUCKET` — подставятся значения по умолчанию (`minio`, `9000`, `false`, `images`), как в workflow.

### 3.4. SSL (первый раз)

На сервере из корня проекта (после `docker volume create` для certbot):

```bash
make init-certs
```

Или вручную по инструкции в `Makefile` (wildcard для `technobar.by` и `*.technobar.by`). Домены в документации/Makefile завязаны на **technobar.by** — при другом домене поправьте команды и nginx.

### 3.5. Запуск стека

```bash
cd /opt/bartech
docker volume create technobar_certbot-etc 2>/dev/null || true
docker volume create technobar_certbot-var 2>/dev/null || true
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Или через Makefile: `make prod-up` (из каталога с репозиторием).

### 3.6. Миграции Prisma и данные

После первого подъёма PostgreSQL выполните миграции (с хоста или из контейнера, если установлен CLI):

```bash
# Пример: с хоста при установленном node/prisma и DATABASE_URL на localhost:5432
npx prisma migrate deploy
```

Либо одноразовый запуск из контейнера nextjs, если в образ добавлен prisma — смотрите, как принято в вашем репозитории. Импорт SQL из `data/*_rows.sql` — по необходимости через `psql`.

---

## 4. GitHub Actions — секреты

В репозитории: **Settings → Secrets and variables → Actions**.

| Secret | Назначение |
|--------|------------|
| `DOCKERHUB_USERNAME` | Логин Docker Hub; используется в `IMAGE_NAME` и в сгенерированном `.env` на сервере |
| `DOCKERHUB_TOKEN` | Access Token Docker Hub (read/write для push образа) |
| `SSH_USER` | Пользователь SSH на сервере |
| `SSH_PRIVATE_KEY` | Приватный ключ (PEM), пара к публичному ключу в `~/.ssh/authorized_keys` на сервере |
| `SERVER_HOST` | IP или hostname сервера |
| `AUTH_SECRET` | Подпись сессий (NextAuth и т.п.), **не короче 32 символов** |
| `DATABASE_URL` | Строка Prisma к PostgreSQL внутри compose, например `postgresql://USER:PASSWORD@postgres:5432/DBNAME?schema=public` |
| `POSTGRES_USER` | Пользователь БД для сервиса `postgres` (должен совпадать с `DATABASE_URL`) |
| `POSTGRES_PASSWORD` | Пароль БД |
| `POSTGRES_DB` | Имя базы |
| `MINIO_ACCESS_KEY` | Ключ доступа MinIO (`MINIO_ROOT_USER` в контейнере) |
| `MINIO_SECRET_KEY` | Секрет MinIO |
| `MINIO_ENDPOINT` | *(необязательно)* по умолчанию `minio` |
| `MINIO_PORT` | *(необязательно)* по умолчанию `9000` |
| `MINIO_USE_SSL` | *(необязательно)* по умолчанию `false` |
| `MINIO_BUCKET` | *(необязательно)* по умолчанию `images` |

Публичный ключ должен быть у пользователя `SSH_USER` на сервере. Приватный ключ не должен иметь passphrase для безинтерактивного CI (или используйте ssh-agent с другим механизмом).

Токен **Cloudflare** для Certbot по-прежнему задаётся в `certbot/cloudflare.ini` на сервере (в git не коммитить); при желании его тоже можно выносить в отдельный механизм, сейчас workflow его не трогает.

---

## 5. Как работает CI/CD

### 5.1. Workflow `Build and Push Docker Image` (`.github/workflows/docker-build-push.yml`)

**Триггеры:**

- Push в `main` / `master`
- Теги `v*`
- Pull request в `main` / `master` (сборка без push в Hub)

**Шаги:**

1. Checkout, Docker Buildx, логин в Docker Hub (не на PR).
2. Сборка образа `linux/amd64`, теги включая **`latest`** для дефолтной ветки.
3. Push на `docker.io/<DOCKERHUB_USERNAME>/bartech`.
4. Job **`deploy`** (в том же файле): запись `/opt/bartech/.env` на сервер из секретов, SSH, `docker pull`, пересоздание только контейнера **`nextjs`** (если уже работает nginx), health check `/api/health`.

### 5.2. Workflow `Deploy to Production` (`.github/workflows/deploy.yml`)

**Триггеры:**

- Успешное завершение workflow **«Build and Push Docker Image»** (`workflow_run`)
- Ручной запуск **workflow_dispatch**

Делает тот же сценарий деплоя по SSH, что и job `deploy` в первом workflow.

**Замечание:** при push в `main` деплой может выполниться **дважды** (сначала job `deploy` в `docker-build-push.yml`, затем `deploy.yml` после завершения всего workflow). Если это лишнее, отключите один из вариантов: например, удалите job `deploy` из `docker-build-push.yml` и оставьте только `deploy.yml`, или наоборот — уберите `deploy.yml`.

---

## 6. Ручной деплой без GitHub

На сервере должен быть актуальный `.env` (после последнего деплоя из Actions он уже есть, либо создайте вручную с теми же ключами, что в секретах):

```bash
cd /opt/bartech
NEXT_IMAGE=$(docker-compose -f docker-compose.yml -f docker-compose.prod.yml config --images 2>/dev/null | grep '/bartech' | head -n1)
[ -z "$NEXT_IMAGE" ] && NEXT_IMAGE="$(awk -F= '/^DOCKERHUB_USERNAME=/ {gsub(/^"|"$/,"",$2); print $2; exit}' .env)/bartech:latest"
docker pull "$NEXT_IMAGE"
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps --force-recreate nextjs
```

Полезные команды из `Makefile`: `make force-update`, `make pull`, `make prod-up`, `make health`.

---

## 7. Проверка после деплоя

- В контейнере: `GET http://127.0.0.1:3000/api/health`
- Снаружи: ваш домен, например `https://technobar.by/api/health` (в workflow зашита дополнительная проверка через этот URL — при смене домена обновите workflow).

Логи:

```bash
cd /opt/bartech
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f nextjs
```

---

## 8. Частые проблемы

| Проблема | Что проверить |
|----------|----------------|
| CI не запускается | Ветка не `main`/`master`; нет push в удалённый репозиторий |
| Push в Docker Hub падает | Секреты `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`, права токена |
| SSH ошибка | `known_hosts`, ключ, пользователь, firewall, `SERVER_HOST` |
| `ERROR: .env file not found` | На сервере нет `/opt/bartech/.env` — сначала выполните деплой из GitHub Actions или создайте файл вручную |
| Сообщение о пустых секретах в логе Actions | Добавьте в GitHub все обязательные секреты из раздела 4 |
| Образ не обновляется | Тот же digest на Hub; попробовать `docker pull ...:latest` с `--no-cache` или `make force-update` |
| Volumes certbot | Создать `technobar_certbot-etc` и `technobar_certbot-var` до первого запуска nginx/certbot |

---

## 9. Локальная разработка с Docker

Сборка и запуск всего стека без prod-override:

```bash
docker compose build
docker compose up -d
```

Убедитесь, что локальный `.env` задаёт `MINIO_*`, `POSTGRES_*`, `AUTH_SECRET` (см. `docker-compose.yml`).

---

Этот документ отражает состояние репозитория на момент последнего обновления; при смене домена, веток или registry поправьте workflow и nginx под вашу инфраструктуру.
