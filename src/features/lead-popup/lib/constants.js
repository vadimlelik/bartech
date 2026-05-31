export const LEAD_POPUP_DELAY_MS = 60 * 1000;

export const LEAD_POPUP_STORAGE = {
  DISMISSED: 'tb-lead-popup-dismissed',
  SUBMITTED: 'tb-lead-popup-submitted',
};

export const LEAD_POPUP_SUBMIT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export const PHONE_REGEX = /^\+375\d{9}$/;

/** Главная и страницы категорий каталога */
export function isLeadPopupAllowedPath(pathname) {
  if (pathname === '/') return true;
  return /^\/categories\/[^/]+$/.test(pathname);
}
