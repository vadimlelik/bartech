export function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/[\s\u00a0]+/g, ' ')
    .trim();
}

/** Нижний регистр и ё→е. Совпадает с триггером localities_sync_name_norm. */
export function normalizeLocalityName(value) {
  return normalizeWhitespace(value).toLowerCase().replaceAll('ё', 'е');
}

const TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

export function localitySlug(name) {
  const raw = normalizeWhitespace(name).toLowerCase();
  let slug = '';
  for (const char of raw) {
    if (TRANSLIT[char] !== undefined) {
      slug += TRANSLIT[char];
    } else if (/[a-z0-9]/.test(char)) {
      slug += char;
    } else {
      slug += '-';
    }
  }
  slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return slug || 'place';
}

export function uniqueLocalitySlug(name, used, osmId) {
  const base = localitySlug(name);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const suffix = String(osmId).replace('-', 'n');
  const withId = `${base}-${suffix}`;
  used.add(withId);
  return withId;
}
