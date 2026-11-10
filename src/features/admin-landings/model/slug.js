// @ts-check

/** @type {Record<string, string>} */
const CYRILLIC_MAP = {
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
  і: 'i',
  ї: 'i',
  є: 'e',
  ґ: 'g',
  ў: 'u',
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @param {string} input
 * @param {{ trimEdges?: boolean }} [options]
 * @returns {string}
 */
export function slugify(input, options = {}) {
  const trimEdges = options.trimEdges !== false;
  const lower = String(input || '').trim().toLowerCase();
  let mapped = '';

  for (const char of lower) {
    if (Object.prototype.hasOwnProperty.call(CYRILLIC_MAP, char)) {
      mapped += CYRILLIC_MAP[char];
    } else {
      mapped += char;
    }
  }

  let slug = mapped.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
  if (trimEdges) {
    slug = slug.replace(/^-+|-+$/g, '');
  }
  return slug;
}

/**
 * @param {string} slug
 * @returns {boolean}
 */
export function isValidSlug(slug) {
  return SLUG_PATTERN.test(slug);
}
