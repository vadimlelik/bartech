export function parseServiceCitySlug(value) {
  if (value == null || value === '') return { slug: null };
  const slug = String(value).trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Некорректный город обслуживания' };
  }
  return { slug };
}

export function resolveServiceCity(locality, cities, fallback = null) {
  const slug = String(locality?.serviceCitySlug || '').trim();
  if (!slug) return fallback;
  const match = (cities || []).find((city) => city?.slug === slug);
  return match || fallback;
}
