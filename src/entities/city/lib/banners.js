import { withCityPrefix } from '../../../shared/config/city-routes.js';

export function normalizeBannerSlugs(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  return [
    ...new Set(
      source
        .map((item) => String(item || '').trim().toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 20);
}

/** Пустой список городов — баннер для всех. Иначе только точное совпадение слага. */
export function bannerMatchesCity(citySlugs, slug) {
  const list = normalizeBannerSlugs(citySlugs);
  if (!list.length) return true;
  return list.includes(String(slug || '').trim().toLowerCase());
}

export function bannerPublicHref(href, citySlug, knownSlugs) {
  const value = String(href || '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith('#')) return value;
  const path = value.startsWith('/') ? value : `/${value}`;
  return withCityPrefix(citySlug, path, knownSlugs);
}
