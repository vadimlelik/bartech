/**
 * Внешнее object storage в URL картинок (старые публичные bucket-URL, пути с /storage/)
 * @param {string} url
 * @returns {boolean}
 */
export function isRemoteStorageImageUrl(url) {
  return Boolean(
    url && (url.includes('.supabase.co') || url.includes('storage')),
  );
}

/**
 * Утилита для проксирования изображений через API route
 * Это уменьшает исходящий трафик, так как изображения кешируются на сервере
 *
 * @param {string} imageUrl - внешний URL (в т.ч. legacy object storage в старых данных)
 * @returns {string} - Проксированный URL через /api/images/
 */
export function getProxiedImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  // Если это уже локальный путь или относительный URL, возвращаем как есть
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }

  // Известные внешние хосты хранения — проксируем через API (старые URL в дампах БД)
  if (isRemoteStorageImageUrl(imageUrl)) {
    // Кодируем URL для безопасной передачи через путь
    const encodedUrl = encodeURIComponent(imageUrl);
    return `/api/images/${encodedUrl}`;
  }

  // Для других внешних URL возвращаем как есть (Next.js Image оптимизирует их)
  return imageUrl;
}
