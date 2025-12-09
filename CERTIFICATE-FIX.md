# Исправление проблемы с сертификатами (technobar.by-0001)

## Проблема

Когда Let's Encrypt создает новый сертификат, а старый еще существует, он добавляет суффикс `-0001`, `-0002` и т.д. к имени директории. Это приводит к тому, что nginx не может найти сертификат по старому пути.

## Решение

### Вариант 1: Обновить путь в nginx.conf (быстрое решение)

Если сертификат уже создан в `technobar.by-0001`, просто обновите путь в `nginx/nginx.conf`:

```nginx
ssl_certificate /etc/letsencrypt/live/technobar.by-0001/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/technobar.by-0001/privkey.pem;
```

Затем перезапустите nginx:
```bash
docker-compose restart nginx
```

### Вариант 2: Удалить старые сертификаты и пересоздать (правильное решение)

1. **Остановите контейнеры:**
   ```bash
   docker-compose down
   ```

2. **Удалите старые сертификаты:**
   ```bash
   make cleanup-certs
   ```
   
   Или вручную:
   ```bash
   docker run --rm \
     -v technobar_certbot-etc:/etc/letsencrypt \
     -v technobar_certbot-var:/var/lib/letsencrypt \
     alpine:latest \
     sh -c "rm -rf /etc/letsencrypt/live/technobar.by* /etc/letsencrypt/renewal/technobar.by* /etc/letsencrypt/archive/technobar.by*"
   ```

3. **Верните путь в nginx.conf на оригинальный:**
   ```nginx
   ssl_certificate /etc/letsencrypt/live/technobar.by/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/technobar.by/privkey.pem;
   ```

4. **Создайте новые сертификаты:**
   ```bash
   make init-certs
   ```

5. **Запустите контейнеры:**
   ```bash
   docker-compose up -d
   ```

## Проверка

Проверьте, что сертификат используется правильно:

```bash
# Проверьте, какие сертификаты существуют
docker exec bartech-nginx ls -la /etc/letsencrypt/live/

# Проверьте конфигурацию nginx
docker exec bartech-nginx nginx -t

# Проверьте SSL соединение
openssl s_client -connect localhost:443 -servername technobar.by < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates
```

## Предотвращение проблемы в будущем

Перед созданием новых сертификатов всегда удаляйте старые:

```bash
make cleanup-certs
make init-certs
```

Или используйте `--force-renewal` флаг (уже используется в `make init-certs`), но лучше сначала очистить старые сертификаты.

## Автоматическое определение пути сертификата

Если вы хотите, чтобы nginx автоматически находил сертификат независимо от суффикса, можно использовать симлинки или скрипт, но это сложнее. Рекомендуется просто удалять старые сертификаты перед созданием новых.

