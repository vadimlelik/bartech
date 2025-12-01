# Инструкция по развертыванию проекта

## Требования

- Docker и Docker Compose установлены на сервере
- Доступ к DNS записям домена (для CertBot)
- Cloudflare API токен (если используется Cloudflare DNS)
- SSH доступ к серверу

## Настройка

### 1. Подготовка сервера

```bash
# Установите Docker и Docker Compose (если еще не установлены)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Клонирование репозитория

```bash
git clone <your-repo-url> /path/to/your/app
cd /path/to/your/app
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DOCKERHUB_USERNAME=your_dockerhub_username
```

### 4. Настройка CertBot

Скопируйте пример конфигурации Cloudflare:

```bash
cp certbot/cloudflare.ini.example certbot/cloudflare.ini
```

Отредактируйте `certbot/cloudflare.ini` и добавьте ваш Cloudflare API токен:

```ini
dns_cloudflare_api_token = your_cloudflare_api_token_here
```

**Важно:** Получите API токен на https://dash.cloudflare.com/profile/api-tokens
Токен должен иметь права: `Zone:Zone:Read` и `Zone:DNS:Edit`

### 5. Получение SSL сертификатов

Перед первым запуском необходимо получить SSL сертификаты:

```bash
# Сделайте скрипт исполняемым
chmod +x scripts/init-certbot.sh

# Запустите инициализацию (укажите ваш email)
# Отредактируйте scripts/init-certbot.sh и замените your-email@example.com на ваш email
./scripts/init-certbot.sh
```

Или вручную:

```bash
docker run --rm \
  -v certbot-etc:/etc/letsencrypt \
  -v certbot-var:/var/lib/letsencrypt \
  -v $(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
  certbot/certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --dns-cloudflare-propagation-seconds 60 \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d cvirko-vadim.ru \
  -d phone2.cvirko-vadim.ru \
  -d tv1.cvirko-vadim.ru \
  -d 1phonefree.cvirko-vadim.ru \
  -d 50discount.cvirko-vadim.ru \
  -d phone.cvirko-vadim.ru \
  -d phone3.cvirko-vadim.ru \
  -d phone4.cvirko-vadim.ru \
  -d phone5.cvirko-vadim.ru \
  -d phone6.cvirko-vadim.ru \
  -d shockproof_phone.cvirko-vadim.ru \
  -d laptop.cvirko-vadim.ru \
  -d bicycles.cvirko-vadim.ru \
  -d motoblok.cvirko-vadim.ru \
  -d pc.cvirko-vadim.ru \
  -d scooter.cvirko-vadim.ru \
  -d laptop_2.cvirko-vadim.ru \
  -d tv2.cvirko-vadim.ru \
  -d tv3.cvirko-vadim.ru \
  -d motoblok_1.cvirko-vadim.ru \
  -d motoblok_2.cvirko-vadim.ru
```

### 6. Запуск приложения

```bash
# Запуск в production режиме
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

## Настройка CI/CD

### GitHub Actions Secrets

Добавьте следующие secrets в настройках GitHub репозитория (Settings → Secrets and variables → Actions):

- `DOCKERHUB_USERNAME` - ваш Docker Hub username
- `DOCKERHUB_TOKEN` - ваш Docker Hub access token
- `SSH_PRIVATE_KEY` - приватный SSH ключ для доступа к серверу
- `SSH_USER` - пользователь для SSH подключения
- `SERVER_HOST` - IP адрес или домен вашего сервера

### Docker Hub Token

1. Зайдите на https://hub.docker.com/settings/security
2. Создайте новый Access Token
3. Скопируйте токен и добавьте в GitHub Secrets как `DOCKERHUB_TOKEN`

### Автоматическое развертывание

После настройки secrets, при каждом push в ветку `main` или `master`:

1. GitHub Actions соберет Docker образ
2. Образ будет загружен в Docker Hub
3. На сервере автоматически обновится приложение (если настроен deploy workflow)

## Обновление сертификатов

Сертификаты автоматически обновляются каждые 12 часов через контейнер certbot.

Для ручного обновления:

```bash
chmod +x scripts/renew-cert.sh
./scripts/renew-cert.sh
```

Или:

```bash
docker-compose exec certbot certbot renew --dns-cloudflare --dns-cloudflare-credentials /cloudflare.ini
docker-compose exec nginx nginx -s reload
```

## Мониторинг

### Проверка здоровья приложения

```bash
curl https://cvirko-vadim.ru/api/health
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f nextjs
docker-compose logs -f nginx
docker-compose logs -f certbot
```

### Перезапуск сервисов

```bash
# Перезапуск всех сервисов
docker-compose restart

# Перезапуск конкретного сервиса
docker-compose restart nextjs
docker-compose restart nginx
```

## Поддомены

Все поддомены автоматически обрабатываются через:
- Nginx конфигурацию (SSL и проксирование)
- Next.js middleware (маршрутизация)

Поддерживаемые поддомены:
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

## Troubleshooting

### Проблемы с сертификатами

```bash
# Проверка статуса сертификатов
docker-compose exec certbot certbot certificates

# Тестовое обновление (dry-run)
docker-compose exec certbot certbot renew --dry-run
```

### Проблемы с Nginx

```bash
# Проверка конфигурации
docker-compose exec nginx nginx -t

# Перезагрузка конфигурации
docker-compose exec nginx nginx -s reload
```

### Очистка Docker

```bash
# Удаление неиспользуемых образов
docker image prune -f

# Удаление неиспользуемых контейнеров
docker container prune -f

# Полная очистка (осторожно!)
docker system prune -a
```

## Безопасность

- Не коммитьте файл `certbot/cloudflare.ini` в Git
- Используйте сильные пароли и токены
- Регулярно обновляйте Docker образы
- Мониторьте логи на предмет подозрительной активности
- Используйте firewall для ограничения доступа к портам

