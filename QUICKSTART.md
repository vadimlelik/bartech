# Быстрый старт - CI/CD для Bartech

## Шаг 1: Подготовка репозитория

```bash
# Убедитесь, что все файлы добавлены в Git
git add .
git commit -m "Setup CI/CD with Docker Hub and CertBot"
git push
```

## Шаг 2: Настройка Docker Hub

1. Зайдите на https://hub.docker.com
2. Создайте репозиторий `bartech`
3. Создайте Access Token: Settings → Security → New Access Token
4. Сохраните токен

## Шаг 3: Настройка GitHub Secrets

В GitHub репозитории: Settings → Secrets and variables → Actions

Добавьте:
- `DOCKERHUB_USERNAME` = ваш Docker Hub username
- `DOCKERHUB_TOKEN` = ваш Docker Hub access token

## Шаг 4: Настройка сервера

### 4.1 Установка Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

### 4.2 Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4.3 Клонирование проекта

```bash
git clone <your-repo-url> /opt/bartech
cd /opt/bartech
```

### 4.4 Настройка переменных окружения

```bash
nano .env
```

Добавьте:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
DOCKERHUB_USERNAME=your_username
```

### 4.5 Настройка Cloudflare API

```bash
cp certbot/cloudflare.ini.example certbot/cloudflare.ini
nano certbot/cloudflare.ini
```

Добавьте ваш Cloudflare API токен:
```ini
dns_cloudflare_api_token = your_token_here
```

Установите правильные права доступа:
```bash
chmod 600 certbot/cloudflare.ini
```

### 4.6 Получение SSL сертификатов

```bash
chmod +x scripts/init-certbot.sh
# Отредактируйте scripts/init-certbot.sh и замените your-email@example.com
./scripts/init-certbot.sh
```

Или используйте Makefile:
```bash
make init-certs
```

### 4.7 Запуск приложения

```bash
make prod-up
# или
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Шаг 5: Настройка автоматического деплоя (опционально)

### 5.1 Генерация SSH ключа

```bash
ssh-keygen -t ed25519 -C "github-actions"
# Сохраните приватный ключ
cat ~/.ssh/id_ed25519
```

### 5.2 Добавление публичного ключа на сервер

```bash
# На сервере
mkdir -p ~/.ssh
echo "ваш_публичный_ключ" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 5.3 Добавление GitHub Secrets

В GitHub: Settings → Secrets and variables → Actions

Добавьте:
- `SSH_PRIVATE_KEY` = содержимое приватного ключа
- `SSH_USER` = ваш пользователь на сервере (root/ubuntu)
- `SERVER_HOST` = IP адрес или домен сервера

### 5.4 Обновление deploy.yml

Отредактируйте `.github/workflows/deploy.yml` и замените `/path/to/your/app` на реальный путь (например `/opt/bartech`)

## Проверка

1. Проверьте GitHub Actions: должен быть успешный build
2. Проверьте Docker Hub: должен появиться образ
3. Проверьте сайт: https://cvirko-vadim.ru
4. Проверьте health: https://cvirko-vadim.ru/api/health

## Полезные команды

```bash
# Логи
make logs

# Статус
make status

# Обновление
make update

# Обновление сертификатов
make renew-certs

# Очистка
make clean
```

## Что дальше?

- ✅ При каждом push в `main` будет автоматическая сборка
- ✅ Образ будет публиковаться в Docker Hub
- ✅ Сертификаты обновляются автоматически каждые 12 часов
- ✅ Nginx перезагружается каждые 6 часов

## Проблемы?

Смотрите подробную документацию в `DEPLOYMENT.md` и `README-CICD.md`

