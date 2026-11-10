import { unstable_cache } from 'next/cache';
import { headers } from 'next/headers';
import { prisma } from '@/shared/lib/prisma';
import { DEFAULT_CITY_SLUG } from '@/shared/config/city-routes';
import { isCityPublic, normalizeHomeCards } from '@/entities/city/lib/city-content';

export const DEFAULT_INSTALLMENT_TERMS = {
  months: [6, 10, 12],
  defaultMonths: 12,
  downPaymentPercent: 10,
  bullets: [
    'Срок рассрочки: до 12 месяцев',
    'Первоначальный взнос: от 10% (в акциях — без взноса)',
    'Без переплат и скрытых комиссий',
    'Одобрение в течение 15–30 минут',
    'Достаточно паспорта гражданина Республики Беларусь',
  ],
};

const MINSK_FALLBACK = {
  slug: 'minsk',
  name: 'Минск',
  nameIn: 'Минске',
  nameGenitive: 'Минска',
  nameDative: 'Минску',
  regionName: 'Минская область',
  enabled: true,
  isDefault: true,
  phoneDisplay: '+375 44 741-84-23',
  phoneTel: '+375447418423',
  email: 'baratexby@gmail.com',
  workHours: 'Понедельник–пятница, 9:00–21:00',
  postalCode: '220013',
  streetAddress: 'ул. Сурганова, д. 43, пом. 804',
  addressLine: '220013, г. Минск, ул. Сурганова, д. 43, пом. 804',
  latitude: 53.9085,
  longitude: 27.5685,
  messengers: [],
  minOrderAmount: null,
  freeDeliveryFrom: 1000,
  deliveryLocalities: ['Минск'],
  installmentTerms: DEFAULT_INSTALLMENT_TERMS,
  hasPickup: true,
  hasDelivery: true,
  aboutParagraphs: [],
  faq: [],
  sortOrder: 0,
  deliveryMethods: [
    {
      id: 'minsk-courier',
      code: 'courier',
      title: 'Курьер по Минску',
      description: 'Доставка по городу',
      price: 10,
      eta: 'В день заказа или на следующий день',
      enabled: true,
      sortOrder: 0,
    },
    {
      id: 'minsk-region',
      code: 'region',
      title: 'Доставка по Беларуси',
      description: 'Доставка за пределы Минска',
      price: 15,
      eta: '1–3 рабочих дня',
      enabled: true,
      sortOrder: 1,
    },
    {
      id: 'minsk-pickup',
      code: 'pickup',
      title: 'Самовывоз',
      description: 'Пункт выдачи в Минске',
      price: 0,
      eta: 'В день заказа',
      enabled: true,
      sortOrder: 2,
    },
  ],
  pickupPoints: [
    {
      id: 'minsk-surgonova',
      title: 'Texnobar, Сурганова',
      address: 'г. Минск, ул. Сурганова, д. 43, пом. 804',
      hours: 'Пн–Пт 9:00–21:00',
      enabled: true,
      sortOrder: 0,
    },
  ],
  paymentMethods: [
    { id: 'minsk-card-online', code: 'card_online', title: 'Банковской картой онлайн', enabled: true, sortOrder: 0 },
    { id: 'minsk-cash', code: 'cash', title: 'Наличными при получении', enabled: true, sortOrder: 1 },
    { id: 'minsk-card-delivery', code: 'card_delivery', title: 'Картой при получении', enabled: true, sortOrder: 2 },
    { id: 'minsk-invoice', code: 'invoice', title: 'Безналичный расчет для юридических лиц', enabled: true, sortOrder: 3 },
    { id: 'minsk-installment', code: 'installment', title: 'Рассрочка', enabled: true, sortOrder: 4 },
  ],
};

function asFaq(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      q: String(item?.q || item?.question || '').trim(),
      a: String(item?.a || item?.answer || '').trim(),
    }))
    .filter((item) => item.q && item.a);
}

function asInstallment(value) {
  const source = value && typeof value === 'object' ? value : {};
  const months = Array.isArray(source.months)
    ? source.months.map(Number).filter((month) => month > 0)
    : DEFAULT_INSTALLMENT_TERMS.months;
  return {
    months: months.length ? months : DEFAULT_INSTALLMENT_TERMS.months,
    defaultMonths: Number(source.defaultMonths) || DEFAULT_INSTALLMENT_TERMS.defaultMonths,
    downPaymentPercent:
      source.downPaymentPercent === null || source.downPaymentPercent === undefined
        ? DEFAULT_INSTALLMENT_TERMS.downPaymentPercent
        : Number(source.downPaymentPercent),
    bullets: Array.isArray(source.bullets) && source.bullets.length
      ? source.bullets.map(String)
      : DEFAULT_INSTALLMENT_TERMS.bullets,
  };
}

function mapMethod(method) {
  return {
    id: method.id,
    code: method.code,
    title: method.title,
    description: method.description || '',
    price: Number(method.price) || 0,
    eta: method.eta || '',
    enabled: method.enabled !== false,
    sortOrder: method.sortOrder || 0,
  };
}

export function serializeCity(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    nameIn: row.nameIn,
    nameGenitive: row.nameGenitive || '',
    nameDative: row.nameDative || '',
    regionName: row.regionName,
    enabled: Boolean(row.enabled),
    isDefault: Boolean(row.isDefault),
    phoneDisplay: row.phoneDisplay,
    phoneTel: row.phoneTel,
    email: row.email || '',
    workHours: row.workHours,
    postalCode: row.postalCode || '',
    streetAddress: row.streetAddress || '',
    addressLine: row.addressLine || '',
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    messengers: Array.isArray(row.messengers) ? row.messengers : [],
    minOrderAmount: row.minOrderAmount ?? null,
    freeDeliveryFrom: row.freeDeliveryFrom ?? null,
    deliveryLocalities: Array.isArray(row.deliveryLocalities) ? row.deliveryLocalities : [],
    installmentTerms: asInstallment(row.installmentTerms),
    hasPickup: Boolean(row.hasPickup),
    hasDelivery: Boolean(row.hasDelivery),
    aboutParagraphs: Array.isArray(row.aboutParagraphs)
      ? row.aboutParagraphs.map((paragraph) => String(paragraph).trim()).filter(Boolean)
      : [],
    faq: asFaq(row.faq),
    publicFields: row.publicFields && typeof row.publicFields === 'object' && !Array.isArray(row.publicFields)
      ? row.publicFields
      : {},
    homeCards: normalizeHomeCards(row.homeCards),
    sortOrder: row.sortOrder || 0,
    deliveryMethods: (row.deliveryMethods || []).map(mapMethod),
    pickupPoints: (row.pickupPoints || []).map((point) => ({
      id: point.id,
      title: point.title,
      address: point.address,
      hours: point.hours || '',
      enabled: point.enabled !== false,
      sortOrder: point.sortOrder || 0,
    })),
    paymentMethods: (row.paymentMethods || []).map((method) => ({
      id: method.id,
      code: method.code,
      title: method.title,
      enabled: method.enabled !== false,
      sortOrder: method.sortOrder || 0,
    })),
  };
}

export function toPublicCity(city) {
  if (!city) return null;
  return {
    ...city,
    deliveryMethods: city.deliveryMethods.filter((method) => method.enabled),
    pickupPoints: city.pickupPoints.filter((point) => point.enabled),
    paymentMethods: city.paymentMethods.filter((method) => method.enabled),
  };
}

const cityInclude = {
  deliveryMethods: { orderBy: { sortOrder: 'asc' } },
  pickupPoints: { orderBy: { sortOrder: 'asc' } },
  paymentMethods: { orderBy: { sortOrder: 'asc' } },
};

async function readCitiesFromDb() {
  const rows = await prisma.city.findMany({
    orderBy: { sortOrder: 'asc' },
    include: cityInclude,
  });
  return rows.map(serializeCity);
}

const getCachedCities = unstable_cache(readCitiesFromDb, ['cities-all-v2'], {
  revalidate: 120,
  tags: ['cities'],
});

export async function getAllCities({ fresh = false } = {}) {
  try {
    const cities = fresh ? await readCitiesFromDb() : await getCachedCities();
    if (!cities?.length) return [serializeCity(MINSK_FALLBACK)];
    return cities;
  } catch (error) {
    console.error('getAllCities:', error);
    return [serializeCity(MINSK_FALLBACK)];
  }
}

function publicCities(cities) {
  return cities.filter((city) => isCityPublic(city)).map(toPublicCity);
}

/**
 * Город индексируемой страницы берётся из URL (заголовок middleware), не из cookie.
 * Cookie не читается здесь: иначе HTML для бота и кэш зависели бы от посетителя.
 * На страницах без городского URL сервер отдаёт Минск.
 * Карточка товара входит в городские адреса: /products/1 — Минск, /grodno/products/1 — Гродно.
 */
export async function getPageCityContext() {
  const headerStore = await headers();
  const headerSlug = headerStore.get('x-city-slug');
  const locked = headerStore.get('x-city-locked') === '1';
  const cities = await getAllCities();
  const visible = publicCities(cities);

  if (headerSlug) {
    const match = cities.find((item) => item.slug === headerSlug);
    if (!match || !isCityPublic(match)) {
      return { pageCity: null, locked: true, cities: visible };
    }
    return { pageCity: toPublicCity(match), locked: true, cities: visible };
  }

  const fallback =
    cities.find((item) => item.slug === DEFAULT_CITY_SLUG) || serializeCity(MINSK_FALLBACK);
  return { pageCity: toPublicCity(fallback), locked, cities: visible };
}

export async function getPageCity() {
  const { pageCity } = await getPageCityContext();
  return pageCity;
}

export async function getEnabledCities() {
  const cities = await getAllCities();
  return publicCities(cities);
}

export async function getIndexableCities() {
  return getEnabledCities();
}

export async function getBannersForCity(slug, placement = 'home') {
  try {
    const rows = await prisma.banner.findMany({
      where: {
        enabled: true,
        placement,
        OR: [{ citySlugs: { isEmpty: true } }, { citySlugs: { has: slug } }],
      },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || '',
      href: row.href || '',
      image: row.image || '',
      placement: row.placement,
      citySlugs: row.citySlugs || [],
    }));
  } catch (error) {
    console.error('getBannersForCity:', error);
    return [];
  }
}
