/**
 * Сборка публичного лендинга из уже существующих полей.
 * Новые блоки без данных не попадают в результат.
 */

/** Вопросы по реальным страницам магазина. Переопределяются через content.faq. */
export const DEFAULT_LANDING_FAQ = [
  {
    q: 'Как доставляете заказ?',
    a: 'По Минску доставка возможна в день заказа или на следующий. По Беларуси обычно 1–3 рабочих дня. Стоимость и исключения — на странице «Оплата и доставка».',
  },
  {
    q: 'Как оформить рассрочку?',
    a: 'Оставьте заявку на этой странице — посчитаем платёж под это предложение. Общие условия банков-партнёров и акции без переплат описаны на странице «Рассрочка».',
  },
  {
    q: 'Можно ли вернуть товар?',
    a: 'Да, на условиях, которые описаны на странице «Возврат товара». Если сомневаетесь, менеджер подскажет до оформления заявки.',
  },
  {
    q: 'Есть ли гарантия?',
    a: 'Техника продаётся с гарантией производителя. Срок и сервисные условия указаны в разделе «Гарантия».',
  },
];

export const GUARANTEE_LINKS = [
  {
    href: '/return',
    title: 'Возврат',
    text: 'Условия возврата товара',
    icon: 'refresh',
  },
  {
    href: '/guarantee',
    title: 'Гарантия',
    text: 'Гарантия производителя',
    icon: 'shield',
  },
  {
    href: '/payment_delivery',
    title: 'Оплата',
    text: 'Оплата и доставка',
    icon: 'card',
  },
];

const ADVANTAGE_ICONS = ['truck', 'shield', 'card', 'refresh', 'clock', 'check'];
const BENEFIT_ICONS = ['check', 'shield', 'truck', 'card', 'clock', 'star'];

function channel(value) {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Белый текст на слишком светлой кнопке не проходит WCAG AA — чуть углубляем цвет. */
export function readableButtonColor(value, fallback) {
  const raw = String(value || '').trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(raw)) return fallback;
  let color = raw.toLowerCase();
  for (let step = 0; step < 8; step += 1) {
    const num = parseInt(color.slice(1), 16);
    const lum = 0.2126 * channel((num >> 16) & 255)
      + 0.7152 * channel((num >> 8) & 255)
      + 0.0722 * channel(num & 255);
    if ((1.05 / (lum + 0.05)) >= 4.5) return color;
    const mix = (part) => Math.max(0, Math.round(part * 0.84));
    const next = (mix((num >> 16) & 255) << 16) | (mix((num >> 8) & 255) << 8) | mix(num & 255);
    color = `#${next.toString(16).padStart(6, '0')}`;
  }
  return color;
}

/**
 * @param {number} count
 * @param {string} one
 * @param {string} few
 * @param {string} many
 */
export function pluralRu(count, one, few, many) {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

/**
 * @param {unknown} value
 */
function asRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {unknown} landing
 */
export function getLandingFaq(landing) {
  const content = asRecord(landing?.content) ? landing.content : {};
  const source = content.faq;
  if (!Array.isArray(source)) return DEFAULT_LANDING_FAQ;

  const custom = source
    .map((item) => {
      if (!asRecord(item)) return null;
      const question = String(item.q || item.question || '').trim();
      const answer = String(item.a || item.answer || '').trim();
      if (!question || !answer) return null;
      return { q: question, a: answer };
    })
    .filter(Boolean);

  return custom.length > 0 ? custom : DEFAULT_LANDING_FAQ;
}

/**
 * @param {unknown} benefit
 */
function toBenefit(benefit) {
  const raw = typeof benefit === 'string'
    ? benefit
    : (asRecord(benefit) ? String(benefit.text || '') : '');
  const text = raw.trim();
  if (!text) return null;
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return {
    title: lines[0],
    text: lines.slice(1).join('\n'),
  };
}

/**
 * @param {unknown} advantage
 */
function toAdvantage(advantage) {
  if (!asRecord(advantage)) return null;
  const title = String(advantage.title || advantage.name || '').trim();
  const description = String(advantage.description || advantage.desc || '').trim();
  if (!title && !description) return null;
  return {
    title: title || description,
    description: title ? description : '',
  };
}

/**
 * @param {unknown} review
 */
function toReview(review) {
  if (!asRecord(review)) return null;
  const text = String(review.text || review.comment || '').trim();
  const image = String(review.image || '').trim();
  const author = String(review.author || '').trim();
  const avatar = String(review.avatar || '').trim();
  const ratingNumber = Number(review.rating);
  const rating = Number.isFinite(ratingNumber)
    ? Math.min(5, Math.max(0, Math.round(ratingNumber)))
    : 0;
  if (!text && !image && !author && !avatar) return null;
  return { text, image, author, avatar, rating };
}

/**
 * @param {unknown} landing
 */
export function buildLandingView(landing) {
  const source = asRecord(landing) ? landing : {};
  const benefits = (Array.isArray(source.benefits) ? source.benefits : [])
    .map(toBenefit)
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      icon: BENEFIT_ICONS[index % BENEFIT_ICONS.length],
    }));
  const advantages = (Array.isArray(source.advantages) ? source.advantages : [])
    .map(toAdvantage)
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      icon: ADVANTAGE_ICONS[index % ADVANTAGE_ICONS.length],
    }));
  const reviews = (Array.isArray(source.reviews) ? source.reviews : [])
    .map(toReview)
    .filter(Boolean);
  const rated = reviews.filter((review) => review.rating > 0);
  const average = rated.length
    ? Math.round((rated.reduce((sum, review) => sum + review.rating, 0) / rated.length) * 10) / 10
    : null;
  const headline = String(source.main_title || source.title || '').trim();
  const description = String(source.description || '').trim();
  const ctaLabel = String(source.button_text || '').trim() || 'Узнать цену';

  return {
    slug: String(source.slug || ''),
    title: String(source.title || headline || 'Лендинг'),
    headline: headline || 'Texnobar',
    description,
    ctaLabel,
    microcopy: String(source.survey_text || '').trim(),
    mainImage: String(source.main_image || '').trim(),
    secondaryImage: String(source.secondary_image || '').trim(),
    benefits,
    advantages,
    reviews,
    rating: {
      average,
      ratedCount: rated.length,
      reviewCount: reviews.length,
    },
    faq: getLandingFaq(source),
    colors: asRecord(source.colors) ? source.colors : {},
    pixels: Array.isArray(source.pixels) ? source.pixels : [],
  };
}
