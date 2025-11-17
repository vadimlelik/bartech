# Оптимизация проекта

## Выполненные оптимизации

### 1. ✅ Удаление console.log из production
- Удалены все `console.log` из production кода
- `console.error` оставлены только для development режима
- Настроен автоматический удаление console в production через Next.js compiler

### 2. ✅ Оптимизация next.config.js
- Включен React Strict Mode
- Включена компрессия (gzip)
- Удален заголовок `X-Powered-By`
- Оптимизированы настройки изображений:
  - Поддержка AVIF и WebP форматов
  - Настроены размеры для разных устройств
  - Минимальное время кэширования
- Включена оптимизация импортов для MUI (`optimizePackageImports`)
- Настроено автоматическое удаление console в production

### 3. ✅ Оптимизация загрузки скриптов аналитики
- Google Analytics загружается с `lazyOnload` стратегией
- Yandex Metrika и TikTok Pixel загружаются через `requestIdleCallback` с задержкой 2 секунды
- Скрипты аналитики не блокируют первоначальную загрузку страницы

### 4. ✅ Динамические импорты
Создан файл `src/shared/utils/dynamicImports.js` с динамическими импортами для:
- Quiz компонента
- Swiper компонентов
- framer-motion

## Рекомендации по использованию

### Использование динамических импортов

Вместо:
```jsx
import Quiz from '@/components/quiz/Quiz';
```

Используйте:
```jsx
import { DynamicQuiz } from '@/shared/utils/dynamicImports';

// В компоненте
<DynamicQuiz {...props} />
```

### Дополнительные оптимизации (опционально)

1. **Оптимизация изображений**: Используйте `priority` только для изображений выше сгиба
2. **Code splitting**: Разделите большие страницы на более мелкие компоненты
3. **Prefetching**: Используйте `next/link` для автоматического prefetching страниц
4. **Service Worker**: Рассмотрите возможность добавления PWA функциональности

## Результаты

После оптимизации ожидается:
- Уменьшение размера бандла на 10-20%
- Улучшение First Contentful Paint (FCP)
- Улучшение Largest Contentful Paint (LCP)
- Улучшение Time to Interactive (TTI)
- Снижение блокирующего времени от скриптов аналитики

