const RU_TO_LAT = {
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

/** Latin slug from a product name. The numeric id stays the stable part of the URL. */
export function slugifyProductName(name) {
  const source = String(name || '').toLocaleLowerCase('ru');
  let slug = '';
  for (const char of source) {
    if (RU_TO_LAT[char] !== undefined) {
      slug += RU_TO_LAT[char];
    } else if (/[a-z0-9]/.test(char)) {
      slug += char;
    } else {
      slug += '-';
    }
  }
  slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (slug.length > 80) {
    slug = slug.slice(0, 80).replace(/-+$/g, '');
  }
  return slug || 'tovar';
}

export function productPublicSegment(product) {
  const id = String(product?.id ?? '').trim();
  return `${id}-${slugifyProductName(product?.name)}`;
}

export function productPublicPath(product) {
  return `/products/${productPublicSegment(product)}`;
}

/** Accepts "17326" and "17326-acer-aspire-lite". */
export function parseProductSegment(segment) {
  let value = String(segment || '').trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }
  value = value.toLowerCase();
  const match = value.match(/^(\d+)(?:-[a-z0-9-]+)?$/);
  if (!match) return null;
  return { id: match[1], segment: value };
}

/** Public pathname split for /products/123 and /grodno/products/123. */
export function splitProductRequestPath(pathname) {
  const parts = String(pathname || '').split('/').filter(Boolean);
  if (parts[0] === 'products' && parts.length === 2) {
    return { prefix: '', segment: parts[1] };
  }
  if (parts.length === 3 && parts[1] === 'products') {
    return { prefix: `/${parts[0]}`, segment: parts[2] };
  }
  return null;
}
