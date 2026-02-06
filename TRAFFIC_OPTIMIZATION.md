# Оптимизация исходящего трафика

## Проблема

Организация превысила квоту кэшированного исходящего трафика. Это происходит, когда изображения из Supabase Storage загружаются через сервер Next.js, создавая исходящий трафик при каждой оптимизации изображения.

## Решения (без перехода на другой тариф)

### 1. Кеширование изображений в Next.js

Настроено кеширование оптимизированных изображений на 60 дней через `next.config.mjs`:
- Минимальное время кеширования: 60 дней
- Автоматическая оптимизация в форматы AVIF и WebP
- Кеширование на стороне сервера Next.js

### 2. API Route для проксирования изображений

Создан API route `/api/images/[...path]` который:
- Проксирует изображения из Supabase Storage
- Кеширует их на сервере Next.js (30 дней)
- Уменьшает количество запросов к Supabase
- Возвращает изображения с правильными заголовками кеширования

**Использование:**
```javascript
import { getProxiedImageUrl } from '@/lib/image-proxy';

const imageUrl = getProxiedImageUrl(supabaseImageUrl);
// Результат: /api/images/https%3A%2F%2Fxxxxx.supabase.co%2Fstorage%2F...
```

### 3. Кеширование в Nginx

Настроено кеширование на уровне Nginx:
- Кеш для `/api/images/` - 7 дней
- Кеш для `/_next/image` - 30 дней
- Кеш для статических изображений из `/public` - 30 дней
- Размер кеша: до 1GB
- Автоматическая очистка неиспользуемых файлов через 7 дней

### 4. Оптимизация Next.js Image компонента

Все изображения используют компонент `next/image` который:
- Автоматически оптимизирует размеры
- Генерирует несколько размеров для разных устройств
- Использует современные форматы (WebP, AVIF)
- Поддерживает lazy loading

## Рекомендации по использованию

### Для новых компонентов

1. **Используйте утилиту проксирования для изображений из Supabase:**
```javascript
import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/image-proxy';

function ProductImage({ imageUrl }) {
  const proxiedUrl = getProxiedImageUrl(imageUrl);
  
  return (
    <Image
      src={proxiedUrl}
      alt="Product"
      width={300}
      height={200}
      loading="lazy"
    />
  );
}
```

2. **Всегда указывайте размеры изображений:**
```javascript
<Image
  src={imageUrl}
  width={300}
  height={200}
  // или
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

3. **Используйте lazy loading для изображений ниже fold:**
```javascript
<Image
  src={imageUrl}
  loading="lazy" // По умолчанию для всех кроме priority
  // или
  priority // Только для изображений выше fold
/>
```

### Миграция существующих компонентов

Для компонентов, которые уже используют изображения из Supabase:

1. Импортируйте утилиту:
```javascript
import { getProxiedImageUrl } from '@/lib/image-proxy';
```

2. Оберните URL изображения:
```javascript
// Было:
<Image src={product.image} />

// Стало:
<Image src={getProxiedImageUrl(product.image)} />
```

## Мониторинг трафика

### Проверка кеширования

1. **Проверьте заголовки ответа:**
```bash
curl -I https://technobar.by/api/images/[encoded-url]
```

Должны быть заголовки:
- `Cache-Control: public, max-age=2592000`
- `X-Cache-Status: HIT` (после первого запроса)

2. **Проверьте кеш Nginx:**
```bash
docker exec bartech-nginx ls -lh /var/cache/nginx/
```

### Метрики для отслеживания

- Количество запросов к `/api/images/`
- Размер кеша Nginx
- Процент попаданий в кеш (X-Cache-Status: HIT)
- Исходящий трафик из Next.js сервера

## Дополнительные оптимизации

### 1. Использование CDN (Cloudflare)

Если используется Cloudflare перед сервером:
- Включите кеширование статических ресурсов
- Настройте правила кеширования для `/api/images/` и `/_next/image`
- Используйте Cloudflare Images для дополнительной оптимизации

### 2. Оптимизация размеров изображений

Перед загрузкой в Supabase:
- Используйте инструменты для сжатия (TinyPNG, ImageOptim)
- Конвертируйте в WebP формат
- Оптимизируйте размеры под реальное использование

### 3. Lazy loading везде

Убедитесь, что все изображения используют `loading="lazy"` кроме критически важных (hero images, выше fold).

## Обновление Docker Compose

Для работы кеша Nginx необходимо создать volume:

```yaml
volumes:
  nginx_cache:
    driver: local
```

И добавить в сервис nginx:
```yaml
volumes:
  - nginx_cache:/var/cache/nginx
```

## Ожидаемые результаты

После внедрения этих оптимизаций:

1. **Снижение исходящего трафика на 70-90%** за счет кеширования
2. **Улучшение скорости загрузки** изображений для пользователей
3. **Снижение нагрузки на Supabase Storage**
4. **Экономия на трафике** без перехода на другой тариф

## Важные замечания

1. **Кеш нужно очищать** при обновлении изображений в Supabase
2. **Мониторьте размер кеша** - он ограничен 1GB в конфигурации Nginx
3. **Проверяйте работу** после деплоя изменений
4. **Тестируйте** на staging окружении перед production

## Поддержка

При возникновении проблем:
1. Проверьте логи Nginx: `docker logs bartech-nginx`
2. Проверьте логи Next.js: `docker logs bartech-nextjs`
3. Проверьте размер кеша: `docker exec bartech-nginx du -sh /var/cache/nginx/`

