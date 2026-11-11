export const COMPANY_PHONE_DISPLAY = '+375 44 741-84-23';
export const COMPANY_PHONE_TEL = '+375447418423';
export const MINSK_ADDRESS_LINE = '220013, г. Минск, ул. Сурганова, д. 43, пом. 804';
export const MINSK_WORK_HOURS = 'Понедельник–пятница, 9:00–21:00';

export function isRealAddress(value) {
  const text = String(value || '').trim();
  if (text.length < 8) return false;
  if (/уточня/i.test(text)) return false;
  return true;
}

export function hasUniqueCityContent(city) {
  if (!city) return false;
  const about = (city.aboutParagraphs || []).some(
    (paragraph) => String(paragraph).trim().length >= 40,
  );
  const faq = (city.faq || []).some(
    (item) =>
      String(item?.q || item?.question || '').trim() &&
      String(item?.a || item?.answer || '').trim(),
  );
  const delivery = (city.deliveryMethods || []).some(
    (method) =>
      method.enabled !== false &&
      String(method.title || '').trim() &&
      String(method.eta || '').trim(),
  );
  const pickup = (city.pickupPoints || []).some(
    (point) => point.enabled !== false && isRealAddress(point.address),
  );
  return about || faq || delivery || pickup;
}

export function isCityPublic(city) {
  return Boolean(city?.enabled);
}

export function isDefaultCity(city) {
  return !city || city.isDefault || city.slug === 'minsk';
}

/** Нет ключа или true — поле видно. false — на сайте его нет. */
export function showCityField(city, key) {
  const flags = city?.publicFields;
  if (!flags || typeof flags !== 'object' || Array.isArray(flags)) return true;
  return flags[key] !== false;
}

function callableTel(value) {
  const compact = String(value || '').replace(/[^\d+]/g, '');
  if (!compact || compact === '+') return '';
  return compact.startsWith('+') ? compact : `+${compact}`;
}

export function cityCall(city) {
  const display = String(city?.phoneDisplay || '').trim();
  const tel = callableTel(city?.phoneTel) || callableTel(display);
  if (display && tel) return { display, tel };
  if (tel) return { display: tel, tel };
  if (isDefaultCity(city)) {
    return { display: COMPANY_PHONE_DISPLAY, tel: COMPANY_PHONE_TEL };
  }
  return null;
}

export function cityAddressLine(city) {
  if (!showCityField(city, 'address')) return '';
  if (isRealAddress(city?.addressLine)) return city.addressLine;
  if (isDefaultCity(city)) return MINSK_ADDRESS_LINE;
  return '';
}

export function cityWorkHours(city) {
  const hours = String(city?.workHours || '').trim();
  if (hours) return hours;
  if (isDefaultCity(city)) return MINSK_WORK_HOURS;
  return '';
}

export function describeDelivery(city) {
  const methods = (city?.deliveryMethods || []).filter(
    (method) => method.enabled !== false && String(method.title || '').trim(),
  );
  if (!methods.length) return '';
  const parts = methods.map((method) => {
    const price = Number(method.price) > 0 ? `${method.price} BYN` : 'бесплатно';
    return [method.title, method.eta, price].filter(Boolean).join(' — ');
  });
  const free =
    showCityField(city, 'freeDelivery') &&
    city?.freeDeliveryFrom !== null &&
    city?.freeDeliveryFrom !== undefined &&
    city.freeDeliveryFrom !== ''
      ? ` Бесплатно от ${city.freeDeliveryFrom} BYN.`
      : '';
  return `${parts.join('. ')}.${free}`;
}

const DEFAULT_HOME_INSTALLMENT_POINTS = [
  'Без первого взноса',
  'Без переплат',
  'Одобрение за сутки',
];

function clipText(value, max) {
  return String(value || '').trim().slice(0, max);
}

function asPointList(value) {
  const source = Array.isArray(value) ? value : String(value || '').split('\n');
  return source
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 8);
}

/** Сохранённые тексты карточек главной. Пустая строка значит «показать стандартный текст». */
export function normalizeHomeCards(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    heroTitle: clipText(source.heroTitle, 160),
    heroText: clipText(source.heroText, 400),
    installmentTitle: clipText(source.installmentTitle, 80),
    installmentPoints: asPointList(source.installmentPoints),
    salesTitle: clipText(source.salesTitle, 80),
    salesText: clipText(source.salesText, 240),
    deliveryTitle: clipText(source.deliveryTitle, 80),
    deliveryText: clipText(source.deliveryText, 240),
  };
}

export function resolveHomeCards(city) {
  const saved = normalizeHomeCards(city?.homeCards);
  const nameIn = city?.nameIn || 'Минске';
  const nameDative = city?.nameDative || city?.name || 'Минску';
  return {
    heroTitle: saved.heroTitle || `Техника в рассрочку в ${nameIn}`,
    heroText:
      saved.heroText ||
      `Смартфоны, ноутбуки и бытовая техника — без переплат и с доставкой по ${nameDative} и Беларуси`,
    installmentTitle: saved.installmentTitle || 'Рассрочка 0%',
    installmentPoints: saved.installmentPoints.length
      ? saved.installmentPoints
      : DEFAULT_HOME_INSTALLMENT_POINTS,
    salesTitle: saved.salesTitle || 'Акции',
    salesText: saved.salesText || 'Текущие предложения магазина',
    deliveryTitle: saved.deliveryTitle || 'Доставка',
    deliveryText: saved.deliveryText || 'Оплата и получение заказа',
  };
}

export function cityFaqItems(city) {
  return (city?.faq || [])
    .map((item) => ({
      q: String(item?.q || item?.question || '').trim(),
      a: String(item?.a || item?.answer || '').trim(),
    }))
    .filter((item) => item.q && item.a);
}
