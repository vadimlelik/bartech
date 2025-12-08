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
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DOCKERHUB_USERNAME=your_dockerhub_username
```

**Важно:** 
- Переменные `NEXT_PUBLIC_*` должны быть доступны как на этапе сборки Docker образа (через build args), так и во время выполнения контейнера. Они встраиваются в клиентский JavaScript bundle во время `npm run build`.
- `SUPABASE_SERVICE_ROLE_KEY` **обязательна** для операций с категориями и других административных операций, которые требуют обхода Row Level Security (RLS). Без этого ключа вы получите ошибку "new row violates row-level security policy". Получите service role key в Supabase Dashboard: Settings → API → service_role key (секретный ключ).

### 4. Настройка CertBot

Скопируйте пример конфигурации Cloudflare:

```bash
cp certbot/cloudflare.ini.example certbot/cloudflare.ini
```

Отредактируйте `certbot/cloudflare.ini` и добавьте ваш Cloudflare API токен:

```ini
dns_cloudflare_api_token = your_cloudflare_api_token_here
```

**Важно:** 
- Получите API токен на https://dash.cloudflare.com/profile/api-tokens
- Токен должен иметь права: `Zone:Zone:Read` и `Zone:DNS:Edit`
- Установите правильные права доступа для файла (только владелец может читать):

```bash
chmod 600 certbot/cloudflare.ini
```

### 5. Получение SSL сертификатов

Перед первым запуском необходимо получить SSL сертификаты:

```bash
# Сделайте скрипт исполняемым
chmod +x scripts/init-certbot.sh

# Запустите инициализацию (укажите ваш email)
# Отредактируйте scripts/init-certbot.sh и замените your-email@example.com на ваш email
./scripts/init-certbot.sh
```

Или вручную (wildcard сертификат для всех поддоменов):

```bash
docker run --rm -it \
  -v cvirko-vadim_certbot-etc:/etc/letsencrypt \
  -v cvirko-vadim_certbot-var:/var/lib/letsencrypt \
  -v $(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro \
  certbot/dns-cloudflare certonly \
  --non-interactive \
  --force-renewal \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --dns-cloudflare-propagation-seconds 60 \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d cvirko-vadim.ru \
  -d "*.cvirko-vadim.ru"
```

**Важно:** Wildcard сертификат (`*.cvirko-vadim.ru`) покрывает все поддомены автоматически. Вы можете создавать новые поддомены без перевыпуска сертификатов.

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
3. **Важно:** Убедитесь, что токен имеет права **"Read, Write & Delete"** (полные права), иначе вы получите ошибку "access token has insufficient scopes"
4. Скопируйте токен и добавьте в GitHub Secrets как `DOCKERHUB_TOKEN`
5. Убедитесь, что репозиторий `bartech` существует в вашем Docker Hub аккаунте (или измените имя в workflow)

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

**Wildcard SSL сертификат:** Используется wildcard сертификат для `*.cvirko-vadim.ru`, который автоматически покрывает все поддомены. Вы можете создавать новые поддомены без перевыпуска сертификатов.

Примеры существующих поддоменов:
- phone2.cvirko-vadim.ru
- tv1.cvirko-vadim.ru
- 1phonefree.cvirko-vadim.ru
- 50discount.cvirko-vadim.ru
- phone.cvirko-vadim.ru
- phone3.cvirko-vadim.ru
- phone4.cvirko-vadim.ru
- phone5.cvirko-vadim.ru
- phone6.cvirko-vadim.ru
- laptop.cvirko-vadim.ru
- bicycles.cvirko-vadim.ru
- motoblok.cvirko-vadim.ru
- pc.cvirko-vadim.ru
- scooter.cvirko-vadim.ru
- tv2.cvirko-vadim.ru
- tv3.cvirko-vadim.ru

**Примечание:** Домены с подчеркиваниями (`shockproof_phone`, `laptop_2`, `motoblok_1`, `motoblok_2`) не могут получить SSL сертификаты, так как подчеркивания недопустимы в DNS именах согласно RFC 1123. Эти домены используются только для внутренней маршрутизации через Next.js middleware.

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

### Проблемы с Supabase RLS (Row Level Security)

#### Ошибка: "new row violates row-level security policy for table 'categories'"

Эта ошибка возникает, когда приложение пытается вставить данные в таблицу `categories`, но не может обойти RLS политику.

**Причины:**
1. Переменная `SUPABASE_SERVICE_ROLE_KEY` не установлена в `.env` файле на сервере
2. Переменная не передана в Docker контейнер через `docker-compose.yml`

**Решение:**

1. Получите service role key в Supabase Dashboard:
   - Зайдите в Settings → API
   - Найдите "service_role key" (секретный ключ)
   - Скопируйте его

2. Добавьте в `.env` файл на сервере:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Убедитесь, что переменная передается в контейнер (уже добавлено в `docker-compose.yml`):
   ```yaml
   environment:
     - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
   ```

4. Перезапустите контейнер:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

5. Проверьте логи на наличие предупреждений:
   ```bash
   docker-compose logs nextjs | grep "SUPABASE_SERVICE_ROLE_KEY"
   ```

**Важно:** Service role key имеет полный доступ к базе данных и обходит все RLS политики. Храните его в безопасности и не коммитьте в Git!

### Проблемы с Docker Hub

#### Ошибка: "access token has insufficient scopes"

Эта ошибка возникает, когда токен Docker Hub не имеет достаточных прав для push в репозиторий.

**Решение:**

1. Создайте новый Access Token на https://hub.docker.com/settings/security
2. Убедитесь, что токен имеет права **"Read, Write & Delete"** (полные права)
3. Обновите секрет `DOCKERHUB_TOKEN` в GitHub (Settings → Secrets and variables → Actions)
4. Убедитесь, что репозиторий `bartech` существует в вашем Docker Hub аккаунте
5. Если репозиторий не существует, создайте его на https://hub.docker.com/repositories или измените имя в `.github/workflows/docker-build-push.yml`

#### Проверка аутентификации Docker Hub

```bash
# Локальная проверка входа в Docker Hub
docker login -u YOUR_USERNAME

# Проверка существования репозитория
docker pull YOUR_USERNAME/bartech:latest
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

