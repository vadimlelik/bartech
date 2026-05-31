export const LEAD_POPUP_DELAY_MS = 30 * 1000;

export const PHONE_REGEX = /^\+375\d{9}$/;

/** Главная и страницы категорий каталога */
export function isLeadPopupAllowedPath(pathname) {
  if (pathname === '/') return true;
  return /^\/categories\/[^/]+$/.test(pathname);
}
