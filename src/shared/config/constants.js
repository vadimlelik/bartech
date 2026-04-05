/**
 * Константы приложения
 * Централизованное хранение всех магических чисел и конфигурационных значений
 */

// Пагинация
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

// Форматирование цен
export const CURRENCY = {
  SYMBOL: 'BYN',
  DECIMAL_PLACES: 2,
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  AUTH_CHECK: '/api/auth/check',
  AUTH_PROFILE: '/api/auth/profile',
};

// Внешние сервисы
export const EXTERNAL_SERVICES = {
  BITRIX24_WEBHOOK: process.env.NEXT_PUBLIC_BITRIX24_WEBHOOK_URL || '',
};

// Валидация
export const VALIDATION = {
  PHONE_REGEX: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  NAME_REGEX: /^[A-Za-zА-Яа-яЁё\s-]{2,50}$/,
  PHONE_SIMPLE_REGEX: /^(\+375|375|80)?(29|25|44|33)(\d{3})(\d{2})(\d{2})$/,
};

// UI константы
export const UI = {
  SKELETON_COUNT: 6, // Количество skeleton элементов при загрузке
  IMAGE_ASPECT_RATIO: 1, // 1:1 для квадратных изображений
  DEBOUNCE_DELAY: 300, // Задержка для debounce (мс)
};

// Сообщения
export const MESSAGES = {
  CART_EMPTY: 'Корзина пуста',
  FAVORITES_EMPTY: 'Список избранного пуст',
  PRODUCTS_NOT_FOUND: 'Товары не найдены',
  LOADING_ERROR: 'Ошибка при загрузке данных',
  ADD_TO_CART_SUCCESS: 'Товар добавлен в корзину',
  ADD_TO_FAVORITES_SUCCESS: 'Товар добавлен в избранное',
  REMOVE_FROM_FAVORITES_SUCCESS: 'Товар удален из избранного',
  ADD_TO_COMPARE_SUCCESS: 'Товар добавлен в сравнение',
  REMOVE_FROM_COMPARE_SUCCESS: 'Товар удален из сравнения',
};

// Сортировка
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE: 'price',
  RATING: 'rating',
  DATE: 'created_at',
  ASC: 'asc',
  DESC: 'desc',
};

// Фильтры
export const FILTER_FIELDS = [
  'memory',
  'ram',
  'processor',
  'display',
  'camera',
  'battery',
  'os',
  'color',
  'year',
];
