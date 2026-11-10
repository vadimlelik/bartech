/**
 * Витринные разделы каталога. Это только группировка уже существующих категорий:
 * id в базе, товары и адреса /categories/[id] не меняются.
 * Категория, которой нет в списке, попадает в «Другие категории».
 */
export const CATALOG_GROUPS = [
  {
    slug: 'smartphones',
    name: 'Смартфоны и гаджеты',
    categoryIds: [
      'apple',
      'honor',
      'huawei',
      'infinix',
      'inoi',
      'poco',
      'samsung',
      'xiaomi',
      'armoredphones',
      'adapter',
    ],
  },
  {
    slug: 'tv',
    name: 'Телевизоры и видео',
    categoryIds: ['tw'],
  },
  {
    slug: 'computers',
    name: 'Ноутбуки и компьютеры',
    categoryIds: ['laptops', 'pc'],
  },
  {
    slug: 'kitchen',
    name: 'Техника для кухни',
    categoryIds: ['fridge'],
  },
  {
    slug: 'home',
    name: 'Техника для дома',
    categoryIds: ['washing'],
  },
  {
    slug: 'garden',
    name: 'Инструменты и садовая техника',
    categoryIds: ['walk-behind-tractor'],
  },
  {
    slug: 'leisure',
    name: 'Спорт, отдых, развлечения',
    categoryIds: ['bicycles', 'motorcycles', 'game-console'],
  },
];

function sameId(left, right) {
  return String(left).toLowerCase() === String(right).toLowerCase();
}

export function findCatalogGroup(categoryId) {
  if (!categoryId) return null;
  return (
    CATALOG_GROUPS.find((group) =>
      group.categoryIds.some((id) => sameId(id, categoryId))
    ) || null
  );
}

export function groupStoreCategories(categories) {
  const list = Array.isArray(categories) ? categories.filter((item) => item?.id && item?.name) : [];
  const used = new Set();

  const groups = CATALOG_GROUPS.map((group) => {
    const items = [];
    for (const id of group.categoryIds) {
      const found = list.find((category) => sameId(category.id, id));
      if (!found || used.has(found.id)) continue;
      items.push(found);
      used.add(found.id);
    }
    return { ...group, categories: items };
  }).filter((group) => group.categories.length > 0);

  const rest = list.filter((category) => !used.has(category.id));
  if (rest.length > 0) {
    groups.push({
      slug: 'other',
      name: 'Другие категории',
      categoryIds: rest.map((category) => category.id),
      categories: rest,
    });
  }

  return groups;
}
