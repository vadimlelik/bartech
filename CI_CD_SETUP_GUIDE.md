# 🚀 Инструкция по настройке CI/CD

## ✅ Что было исправлено

1. **Исправлена проблема с запуском контейнеров** - теперь все контейнеры (`nextjs`, `nginx`, `certbot`) запускаются вместе одной командой, что гарантирует правильную работу зависимостей
2. **Исправлено в обоих workflow файлах:**
   - `.github/workflows/deploy.yml` 
   - `.github/workflows/docker-build-push.yml`

---

## 📋 Чеклист настройки CI/CD

### 1. Настройка GitHub Secrets

Перейдите в ваш репозиторий на GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

#### Обязательные Secrets:

| Secret | Описание | Где получить |
|--------|----------|--------------|
| `DOCKERHUB_USERNAME` | Ваш username в Docker Hub | https://hub.docker.com/settings/account |
| `DOCKERHUB_TOKEN` | Access Token для Docker Hub | Docker Hub → Account Settings → Security → New Access Token |
| `SSH_USER` | Пользователь для SSH (обычно `root`) | Ваш сервер |
| `SERVER_HOST` | IP или домен сервера (например: `123.45.67.89` или `server.example.com`) | Ваш сервер |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ для подключения к серверу | Сгенерируйте: `ssh-keygen -t ed25519 -C "github-actions"` |

#### Опциональные Secrets (для сборки с правильными переменными):

| Secret | Описание |
|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL вашего Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key из Supabase |

---

### 2. Настройка сервера

#### 2.1 Подготовка SSH ключа

**На вашем локальном компьютере:**

```bash
# Сгенерируйте SSH ключ (если еще нет)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Скопируйте публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@YOUR_SERVER_IP

# Или вручную добавьте содержимое ~/.ssh/github_actions_deploy.pub в:
# /root/.ssh/authorized_keys на сервере
```

**Скопируйте приватный ключ в GitHub Secrets:**
```bash
cat ~/.ssh/github_actions_deploy
# Скопируйте весь вывод (включая -----BEGIN и -----END) в GitHub Secret SSH_PRIVATE_KEY
```

#### 2.2 Настройка директории на сервере

**Подключитесь к серверу:**
```bash
ssh root@YOUR_SERVER_IP
```

**Создайте директорию проекта:**
```bash
mkdir -p /opt/bartech
cd /opt/bartech
```

#### 2.3 Создайте файл `.env` на сервере

```bash
nano /opt/bartech/.env
```

**Минимальный `.env` файл должен содержать:**

```bash
# Docker Hub
DOCKERHUB_USERNAME=your_dockerhub_username

# Supabase (обязательно для работы приложения)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Важно:** 
- Замените `your_dockerhub_username` на ваш реальный username
- Замените все значения Supabase на реальные из вашего проекта

#### 2.4 Скопируйте необходимые файлы на сервер

**С вашего локального компьютера:**

```bash
# Скопируйте docker-compose файлы
scp docker-compose.yml root@YOUR_SERVER_IP:/opt/bartech/
scp docker-compose.prod.yml root@YOUR_SERVER_IP:/opt/bartech/

# Скопируйте конфигурацию nginx
scp -r nginx/ root@YOUR_SERVER_IP:/opt/bartech/

# Скопируйте конфигурацию certbot
scp -r certbot/ root@YOUR_SERVER_IP:/opt/bartech/

# Скопируйте скрипты (если нужны)
scp -r scripts/ root@YOUR_SERVER_IP:/opt/bartech/
```

#### 2.5 Установка Docker и Docker Compose на сервере

**Если Docker еще не установлен:**

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверка
docker --version
docker-compose --version
```

#### 2.6 Создание Docker volumes

```bash
cd /opt/bartech
docker volume create technobar_certbot-etc
docker volume create technobar_certbot-var
```

---

### 3. Проверка работоспособности

#### 3.1 Тест SSH подключения из GitHub Actions

**В GitHub репозитории:**
1. Перейдите в **Actions**
2. Выберите workflow **"Deploy to Production"**
3. Нажмите **"Run workflow"** → **"Run workflow"**

**Проверьте логи:**
- Должно успешно подключиться к серверу
- Должен найти `.env` файл
- Должны создаться volumes (если их нет)

#### 3.2 Тест сборки образа

**В GitHub репозитории:**
1. Перейдите в **Actions**
2. Выберите workflow **"Build and Push Docker Image"**
3. Нажмите **"Run workflow"** → **"Run workflow"**

**Проверьте:**
- Образ должен успешно собраться
- Образ должен быть загружен в Docker Hub
- Проверьте в Docker Hub: `https://hub.docker.com/r/YOUR_USERNAME/bartech/tags`

#### 3.3 Полный тест деплоя

**Сделайте коммит и пуш в ветку `main` или `master`:**

```bash
git add .
git commit -m "test: CI/CD deployment"
git push origin main
```

**Что должно произойти автоматически:**
1. ✅ Запустится workflow "Build and Push Docker Image"
2. ✅ После успешной сборки запустится "Deploy to Production"
3. ✅ На сервере должны запуститься все 3 контейнера:
   - `bartech-nextjs`
   - `bartech-nginx`
   - `bartech-certbot`

**Проверка на сервере:**

```bash
ssh root@YOUR_SERVER_IP
cd /opt/bartech
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

**Ожидаемый вывод:**
```
NAME                STATUS              PORTS
bartech-nextjs     Up (healthy)         ...
bartech-nginx       Up                  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
bartech-certbot     Up                  ...
```

---

### 4. Проверка логов при проблемах

#### 4.1 Логи GitHub Actions

Если что-то пошло не так, проверьте логи в:
- **Actions** → выберите failed workflow → просмотрите логи каждого шага

#### 4.2 Логи на сервере

```bash
# Логи всех контейнеров
cd /opt/bartech
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs

# Логи конкретного контейнера
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nextjs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs certbot

# Статус контейнеров
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

#### 4.3 Ручная проверка на сервере

```bash
# Проверка, что образ загружен
docker images | grep bartech

# Проверка health endpoint
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nextjs wget --spider http://127.0.0.1:3000/api/health

# Проверка переменных окружения
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nextjs env | grep SUPABASE
```

---

### 5. Типичные проблемы и решения

#### Проблема: "ERROR: .env file not found!"

**Решение:**
- Убедитесь, что файл `.env` существует в `/opt/bartech/.env` на сервере
- Проверьте права доступа: `chmod 600 /opt/bartech/.env`

#### Проблема: "ERROR: DOCKERHUB_USERNAME not set in .env file!"

**Решение:**
- Добавьте `DOCKERHUB_USERNAME=your_username` в `/opt/bartech/.env`
- Убедитесь, что нет пробелов вокруг `=`: `KEY=value`, а не `KEY = value`

#### Проблема: "ERROR: Failed to pull image"

**Решение:**
- Проверьте, что образ действительно есть в Docker Hub
- Проверьте, что `DOCKERHUB_USERNAME` правильный
- Убедитесь, что образ публичный или у вас есть доступ

#### Проблема: "SSH connection failed"

**Решение:**
- Проверьте, что `SSH_PRIVATE_KEY` в GitHub Secrets правильный (включая все строки)
- Проверьте, что публичный ключ добавлен в `~/.ssh/authorized_keys` на сервере
- Проверьте, что `SERVER_HOST` правильный (IP или домен)
- Проверьте firewall на сервере: порт 22 должен быть открыт

#### Проблема: Контейнеры не запускаются

**Решение:**
```bash
# На сервере проверьте логи
cd /opt/bartech
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs

# Проверьте, что volumes созданы
docker volume ls | grep technobar

# Попробуйте запустить вручную
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

### 6. Структура CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│  Push в main/master или создание тега v*                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Workflow: Build and Push Docker Image                  │
│  1. Checkout code                                       │
│  2. Setup Docker Buildx                                 │
│  3. Login to Docker Hub                                 │
│  4. Build Docker image                                  │
│  5. Push to Docker Hub (tag: latest)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (автоматически после успеха)
┌─────────────────────────────────────────────────────────┐
│  Workflow: Deploy to Production                         │
│  1. Checkout code                                       │
│  2. Setup SSH                                           │
│  3. Connect to server                                   │
│  4. Pull latest image from Docker Hub                   │
│  5. Stop old containers                                 │
│  6. Start all containers (nextjs, nginx, certbot)       │
│  7. Wait for health check                               │
│  8. Reload Nginx                                        │
│  9. Verify deployment                                   │
└─────────────────────────────────────────────────────────┘
```

---

### 7. Ручной деплой (если нужно)

Если CI/CD не работает, можно задеплоить вручную:

```bash
# На сервере
cd /opt/bartech

# Загрузить переменные из .env
set -a
source .env
set +a

# Обновить образ
docker pull ${DOCKERHUB_USERNAME}/bartech:latest

# Перезапустить контейнеры
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate
```

---

## ✅ Финальная проверка

После настройки убедитесь, что:

- [ ] Все GitHub Secrets настроены
- [ ] `.env` файл создан на сервере в `/opt/bartech/.env`
- [ ] Docker volumes созданы на сервере
- [ ] Docker и Docker Compose установлены на сервере
- [ ] SSH ключ добавлен на сервер
- [ ] Тестовая сборка прошла успешно
- [ ] Тестовый деплой прошел успешно
- [ ] Все 3 контейнера запущены на сервере
- [ ] Приложение доступно по домену

---

## 📞 Дополнительная помощь

Если возникли проблемы:
1. Проверьте логи GitHub Actions
2. Проверьте логи на сервере: `docker-compose logs`
3. Проверьте статус контейнеров: `docker-compose ps`
4. Убедитесь, что все переменные окружения установлены правильно

