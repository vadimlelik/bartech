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

**Где выполнять:** На вашей локальной машине (компьютере, с которого вы работаете)

**Что создается:**
- Приватный ключ (`~/.ssh/id_ed25519`) - секретный ключ, который будет использоваться GitHub Actions для подключения к серверу
- Публичный ключ (`~/.ssh/id_ed25519.pub`) - открытый ключ, который будет добавлен на сервер

**Пошаговая инструкция:**

1. Откройте терминал на вашей локальной машине (PowerShell на Windows, Terminal на Mac/Linux)

2. Выполните команду для генерации ключа:
```bash
ssh-keygen -t ed25519 -C "github-actions"
```

3. При запросе места сохранения нажмите Enter (по умолчанию сохранится в `~/.ssh/id_ed25519`)
   - На Windows: `C:\Users\ваше_имя\.ssh\id_ed25519`
   - На Mac/Linux: `~/.ssh/id_ed25519` (обычно `/home/ваше_имя/.ssh/id_ed25519`)

4. При запросе пароля можете оставить пустым (нажмите Enter дважды) или установить пароль для дополнительной безопасности

5. После генерации скопируйте **приватный ключ** (он понадобится для GitHub Secrets):
```bash
# На Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519

# На Mac/Linux
cat ~/.ssh/id_ed25519
```

6. Скопируйте **публичный ключ** (он понадобится для добавления на сервер):
```bash
# На Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub

# На Mac/Linux
cat ~/.ssh/id_ed25519.pub
```

**Важно:** Скопируйте оба ключа в безопасное место (например, в текстовый файл), они понадобятся на следующих шагах.

### 5.2 Добавление публичного ключа на сервер

**Где выполнять:** На вашем сервере (через SSH подключение)

**Что происходит:** Публичный ключ добавляется в файл `authorized_keys` на сервере, что позволяет GitHub Actions подключаться к серверу без пароля.

**Пошаговая инструкция:**

1. Подключитесь к вашему серверу по SSH:
```bash
ssh ваш_пользователь@ваш_сервер_IP
# Например: ssh root@192.168.1.100
# или: ssh ubuntu@cvirko-vadim.ru
```

2. Убедитесь, что директория `.ssh` существует (если нет - создастся автоматически):
```bash
mkdir -p ~/.ssh
```

3. Добавьте публичный ключ в файл `authorized_keys`:
```bash
# Замените "ваш_публичный_ключ" на реальный публичный ключ, который вы скопировали на шаге 5.1
echo "ваш_публичный_ключ" >> ~/.ssh/authorized_keys
```

   **Пример:** Если ваш публичный ключ начинается с `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5...`, команда будет:
   ```bash
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... github-actions" >> ~/.ssh/authorized_keys
   ```

4. Установите правильные права доступа на файл (это важно для безопасности):
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

5. Проверьте, что ключ добавлен корректно:
```bash
cat ~/.ssh/authorized_keys
```

**Альтернативный способ (если у вас уже есть доступ к серверу):**

Вы можете скопировать публичный ключ напрямую с локальной машины на сервер:
```bash
# С вашей локальной машины
ssh-copy-id -i ~/.ssh/id_ed25519.pub ваш_пользователь@ваш_сервер_IP
```

**Что создается на сервере:**
- Файл `~/.ssh/authorized_keys` (если его не было) или ключ добавляется в существующий файл
- Этот файл содержит список публичных ключей, которым разрешено подключаться к серверу

### 5.3 Добавление GitHub Secrets

В GitHub: Settings → Secrets and variables → Actions

Добавьте:
- `SSH_PRIVATE_KEY` = содержимое приватного ключа
- `SSH_USER` = ваш пользователь на сервере (root/ubuntu)
- `SERVER_HOST` = IP адрес или домен сервера

### 5.4 Обновление deploy.yml

**Где выполнять:** На вашей локальной машине (в репозитории проекта)

**Что нужно сделать:** Заменить путь `/path/to/your/app` на реальный путь к проекту на сервере.

**Как узнать реальный путь:**

1. **Вспомните, куда вы клонировали проект на сервере** (см. раздел 4.3):
   - Если вы следовали инструкции из раздела 4.3, путь будет `/opt/bartech`
   - Если вы клонировали в другое место, используйте тот путь

2. **Проверьте путь на сервере** (если не уверены):
   ```bash
   # Подключитесь к серверу
   ssh ваш_пользователь@ваш_сервер_IP
   
   # Найдите директорию проекта
   find / -name "docker-compose.yml" -type f 2>/dev/null | grep bartech
   # или
   ls -la /opt/bartech
   # или просто проверьте, где вы находились при клонировании:
   pwd
   ```

3. **Откройте файл `.github/workflows/deploy.yml`** на вашей локальной машине

4. **Найдите строку 31** (или строку с `cd /path/to/your/app`)

5. **Замените `/path/to/your/app` на реальный путь**, например:
   ```yaml
   cd /opt/bartech
   ```

   **Пример полного блока после замены:**
   ```yaml
   - name: Deploy to server
     run: |
       ssh ${{ secrets.SSH_USER }}@${{ secrets.SERVER_HOST }} << 'EOF'
         cd /opt/bartech
         docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull
         docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
         docker-compose exec -T nginx nginx -s reload
         docker image prune -f
       EOF
   ```

6. **Сохраните файл и закоммитьте изменения:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update deploy path in workflow"
   git push
   ```

**Важно:** Путь должен быть абсолютным (начинаться с `/`) и указывать на директорию, где находится файл `docker-compose.yml` вашего проекта.

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

