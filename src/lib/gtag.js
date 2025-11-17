export const GA_TRACKING_ID = 'G-Z9FPYDW23Z';

// Проверка доступности gtag
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Отправка события просмотра страницы
export const pageview = (url) => {
  if (isGtagAvailable()) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Отправка кастомного события
export const event = ({ action, category, label, value }) => {
  if (isGtagAvailable()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
