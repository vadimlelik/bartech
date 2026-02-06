/**
 * Утилита для проксирования изображений через API route
 * Это уменьшает исходящий трафик, так как изображения кешируются на сервере
 * 
 * @param {string} imageUrl - URL изображения из Supabase Storage
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

  // Если это URL из Supabase Storage, проксируем через API
  if (imageUrl.includes('.supabase.co') || imageUrl.includes('storage')) {
    // Кодируем URL для безопасной передачи через путь
    const encodedUrl = encodeURIComponent(imageUrl);
    return `/api/images/${encodedUrl}`;
  }

  // Для других внешних URL возвращаем как есть (Next.js Image оптимизирует их)
  return imageUrl;
}

/**
 * Проверяет, является ли URL изображением из Supabase Storage
 * @param {string} url - URL для проверки
 * @returns {boolean}
 */
export function isSupabaseImageUrl(url) {
  return url && (url.includes('.supabase.co') || url.includes('storage'));
}

