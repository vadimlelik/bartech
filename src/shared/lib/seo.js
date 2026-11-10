/**
 * SEO utilities for generating structured data and metadata
 */

import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { withCityPrefix } from '@/shared/config/city-routes';
import { findCatalogGroup } from '@/shared/config/catalog-groups';
import { getStaticCategorySeo } from '@/shared/config/category-static-seo';
import { categoryPublicPath } from '@/shared/lib/category-path';
import { productPublicPath } from '@/shared/lib/product-path';
import { getBusinessSameAs } from '@/shared/config/business-profiles';
import {
  INSTALLMENT_FAQ_ITEMS,
  INSTALLMENT_CITABILITY_QUESTION,
  INSTALLMENT_CITABILITY_ANSWER,
  HOME_FAQ_ITEMS,
  HOME_CITABILITY_QUESTION,
  HOME_CITABILITY_ANSWER,
} from '@/shared/content/seo-faq';

/** Next.js file-based OG image (PNG 1200×630). Prefer over SVG for social previews. */
export const DEFAULT_OG_IMAGE_PATH = '/opengraph-image';
export const DEFAULT_OG_IMAGE_ALT =
  'Texnobar — интернет-магазин техники в рассрочку, Минск';
export const DEFAULT_OG_IMAGE = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;

export function buildDefaultOpenGraphImages(alt = DEFAULT_OG_IMAGE_ALT) {
  return [
    {
      url: DEFAULT_OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt,
    },
  ];
}

/** Display name for category in breadcrumbs and metadata. */
export function resolveProductCategoryLabel(product, category) {
  if (category?.name && String(category.name).trim()) {
    return String(category.name).trim();
  }
  if (product?.category && String(product.category).trim()) {
    return String(product.category).trim();
  }
  if (product?.categoryId) {
    return String(product.categoryId);
  }
  return null;
}

export function buildProductBreadcrumbs(product, category, productId, citySlug) {
  const linkedProduct = product?.id ? product : { ...product, id: productId };
  const categoryLabel = resolveProductCategoryLabel(product, category);
  const categoryId = product?.categoryId || product?.category_id;
  const brandRaw = product?.specifications?.brand;
  const brand =
    brandRaw && String(brandRaw).trim() ? String(brandRaw).trim() : null;
  const brandRepeatsCategory =
    brand &&
    categoryLabel &&
    brand.toLocaleLowerCase('ru') === categoryLabel.toLocaleLowerCase('ru');

  const group = findCatalogGroup(categoryId);

  return [
    { name: 'Главная', url: withCityPrefix(citySlug, '/') },
    { name: 'Каталог', url: '/catalog' },
    ...(group
      ? [{ name: group.name, url: `/catalog/${group.slug}` }]
      : []),
    ...(categoryId && categoryLabel
      ? [{ name: categoryLabel, url: withCityPrefix(citySlug, categoryPublicPath(categoryId)) }]
      : []),
    ...(brand && !brandRepeatsCategory
      ? [
          {
            name: brand,
            url: categoryId
              ? withCityPrefix(
                  citySlug,
                  `${categoryPublicPath(categoryId)}?search=${encodeURIComponent(brand)}`,
                )
              : undefined,
          },
        ]
      : []),
    { name: product.name, url: withCityPrefix(citySlug, productPublicPath(linkedProduct)) },
  ];
}

/** Primary commercial phrase for titles and copy (natural language + common variants). */
export const SEO_INSTALLMENT_PHRASES = [
  'купить в рассрочку',
  'покупка в рассрочку',
  'рассрочка без переплат',
  'техника в рассрочку минск',
  'рассрочка минск',
  'купить телефон в рассрочку минск',
  'купить ноутбук в рассрочку минск',
  'рассрочка онлайн минск',
  'интернет-магазин рассрочка беларусь',
  'купить технику в рассрочку беларусь',
];

/** Доп. фразы для главной и общих метаданных (коммерческий интент, не только бренд). */
export const COMMERCIAL_SEO_KEYWORDS = [
  ...SEO_INSTALLMENT_PHRASES,
  'купить телефон в рассрочку',
  'купить смартфон в рассрочку минск',
  'купить телевизор в минске',
  'купить телевизор в рассрочку',
  'купить ноутбук в минске',
  'купить ноутбук в рассрочку',
  'купить технику в минске',
  'магазин техники минск рассрочка',
];

/** Title stays within the typical SERP width and does not repeat the root template. */
export function categoryTitleFromName(name) {
  const label = String(name || 'Техника').trim();
  const primary = `${label} в рассрочку в Минске — купить в Технобар`;
  if (primary.length <= 60) return primary;
  const compact = `${label} в рассрочку в Минске — Технобар`;
  if (compact.length <= 60) return compact;
  return clampMeta(`${label} — рассрочка, Технобар`, 60);
}

export function clampMeta(text, max = 155) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  const base = (space > 40 ? cut.slice(0, space) : cut).trim();
  return `${base}…`;
}

function categoryDescriptionFromName(name, extra) {
  const label = String(name || 'Техника').trim();
  if (extra) {
    return clampMeta(
      `${label} в рассрочку в Минске и по Беларуси. ${extra} Без переплат по акциям. Технобар.`,
    );
  }
  return clampMeta(
    `${label} в рассрочку в Минске и по Беларуси: каталог с ценами, срок до 12 месяцев, без переплат по акциям. Технобар.`,
  );
}

/**
 * SEO для страницы категории.
 * Title по шаблону «{Категория} в рассрочку в Минске — купить в Технобар».
 * Готовый description из category-static-seo.js сохраняется, если он уместной длины.
 */
export function getCategorySeoCopy(category) {
  const name = (category?.name && String(category.name).trim()) || 'товары';
  const lower = name.toLowerCase();
  const staticSeo = getStaticCategorySeo(category?.id);
  const extra =
    category?.description && String(category.description).trim()
      ? String(category.description).trim()
      : '';

  const title = staticSeo?.title || categoryTitleFromName(name);
  const description = staticSeo?.description
    ? clampMeta(staticSeo.description)
    : categoryDescriptionFromName(name, extra);
  const introParagraph =
    staticSeo?.introParagraph ||
    (extra
      ? `${extra} Ниже — актуальные модели и цены; рассрочка и доставка по Минску и Беларуси.`
      : `В каталоге Технобар можно выбрать ${lower} и оформить рассрочку в Минске: цены в BYN, доставка по Беларуси, без переплат в рамках акций.`);

  const keywords = [
    ...(staticSeo?.extraKeywords || []),
    `купить ${lower} в рассрочку`,
    `купить ${lower} в минске`,
    `${lower} в рассрочку минск`,
    name,
    ...SEO_INSTALLMENT_PHRASES.slice(0, 6),
  ];

  return { title, description, introParagraph, keywords };
}

/**
 * Self-contained answer block (~134–167 words) for category pages (GEO citability).
 */
export function getCategoryCitabilityBlock(category) {
  const staticSeo = getStaticCategorySeo(category?.id);
  if (staticSeo?.citabilityParagraph) {
    return staticSeo.citabilityParagraph;
  }

  const name = (category?.name && String(category.name).trim()) || 'технику';
  const lower = name.toLowerCase();

  return `Купить ${lower} в рассрочку в Минске можно в интернет-магазине Texnobar (technobar.by) — каталог с актуальными ценами в BYN и оформлением онлайн. Вы выбираете модель на странице категории «${name}», оставляете заявку на рассрочку и получаете ответ менеджера обычно за 15–30 минут в рабочее время. Условия: срок до 12 месяцев, первоначальный взнос от 10%, в акциях — без первого платежа и без переплат в рамках партнёрских программ. Доставка по Минску — в день заказа, по Беларуси — за 1–3 рабочих дня. Texnobar (ООО «Баратех») продаёт оригинальную технику с гарантией; адрес: г. Минск, ул. Сурганова, 43, телефон +375 (25) 776-64-62.`;
}

export function getCategoryCitabilityQuestion(category) {
  const name = (category?.name && String(category.name).trim()) || 'технику';
  return `Как купить ${name.toLowerCase()} в рассрочку в Минске?`;
}

const CATEGORY_TERMS_PARAGRAPH =
  'Заявку оставляют на сайте: менеджер перезванивает обычно за 15–30 минут в рабочее время. Срок — до 12 месяцев, первоначальный взнос от 10%, в отдельных акциях первый платёж не нужен. По акциям и партнёрским программам нет переплат и скрытых комиссий. Чаще всего достаточно паспорта гражданина Республики Беларусь. Доставка по Минску — в день заказа, по Беларуси — за 1–3 рабочих дня. Подробные условия собраны на странице «Рассрочка».';

/** Visible category copy, about 100–200 words, only from catalog text and /installment. */
export function getCategoryArticleParagraphs(category) {
  const seo = getCategorySeoCopy(category);
  const paragraphs = [seo.introParagraph].filter(Boolean);
  const citability = getCategoryCitabilityBlock(category);
  if (citability && citability !== seo.introParagraph) {
    paragraphs.push(citability);
  }
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  if (words < 100) {
    paragraphs.push(CATEGORY_TERMS_PARAGRAPH);
  }
  return paragraphs;
}

/** FAQ answers are copied from the installment page. A bank-card question is not stated there. */
export function getCategoryFaqItems(category) {
  const name = (category?.name && String(category.name).trim()) || 'технику';
  const lower = name.toLocaleLowerCase('ru');
  const answer = (question) =>
    INSTALLMENT_FAQ_ITEMS.find((item) => item.q === question)?.a || '';

  return [
    {
      q: `Как оформить рассрочку на ${lower}?`,
      a: answer('Как купить в рассрочку в Texnobar?'),
    },
    {
      q: 'Какие документы нужны для рассрочки?',
      a: answer('Нужна ли справка о доходах?'),
    },
    {
      q: 'На какой срок оформляется рассрочка?',
      a: answer('На какой срок доступна рассрочка?'),
    },
    {
      q: 'Есть ли переплата при рассрочке?',
      a: answer('Есть ли переплаты при покупке в рассрочку?'),
    },
  ].filter((item) => item.a);
}

export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function getProductPageTitle(product) {
  const name = String(product?.name || 'Товар').trim();
  const brand = String(product?.specifications?.brand || '').trim();
  const withBrand =
    brand && !name.toLocaleLowerCase('ru').includes(brand.toLocaleLowerCase('ru'))
      ? `${brand} ${name}`
      : name;
  return clampMeta(`${withBrand} — в рассрочку в Минске, Технобар`, 70);
}

export function getProductPageDescription(product) {
  const name = String(product?.name || 'Товар').trim();
  const full = Number(product?.totalPrice ?? product?.total_price);
  const priceBit =
    Number.isFinite(full) && full > 0 ? ` Цена ${full.toLocaleString('ru-RU')} BYN.` : '';
  const own = String(product?.description || '').replace(/\s+/g, ' ').trim();
  const lead = `${name} в рассрочку в Минске и по Беларуси.${priceBit} Без переплат по акциям.`;
  return clampMeta(own ? `${lead} ${own}` : `${lead} Технобар.`);
}

/** Build FAQPage JSON-LD from { q, a } items. */
export function getFaqPageSchema(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export {
  INSTALLMENT_FAQ_ITEMS,
  INSTALLMENT_CITABILITY_QUESTION,
  INSTALLMENT_CITABILITY_ANSWER,
  HOME_FAQ_ITEMS,
  HOME_CITABILITY_QUESTION,
  HOME_CITABILITY_ANSWER,
};

const BUSINESS_ADDRESS = {
  streetAddress: 'ул. Сурганова, д. 43',
  addressLocality: 'Минск',
  postalCode: '220013',
  addressCountry: 'BY',
};

const BUSINESS_PHONE = '+375257766462';
const BUSINESS_EMAIL = 'baratexby@gmail.com';

/** Дата priceValidUntil (YYYY-MM-DD) — рекомендуется Google для Offer. */
function priceValidUntilIso(daysFromNow = 365) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

/**
 * Политика возврата для Offer — требование Google (hasMerchantReturnPolicy в offers).
 * Согласовано с публичной страницей /return (14 дней).
 * @see https://schema.org/MerchantReturnPolicy
 */
function buildMerchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    '@id': `${siteUrl}/return#merchant-return-policy`,
    url: `${siteUrl}/return`,
    applicableCountry: 'BY',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  };
}

/**
 * Доставка для Offer — требование Google Merchant listings (shippingDetails в offers).
 * Сверяйте shippingRate и сроки с фактическими условиями на сайте / в оформлении заказа.
 * @see https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#offer-shipping-details-properties
 */
function buildOfferShippingDetails(shippingRate = 0) {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: Number(shippingRate) || 0,
      currency: 'BYN',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'BY',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'DAY',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 7,
        unitCode: 'DAY',
      },
    },
  };
}

/**
 * Абсолютный URL картинки товара (fallback — логотип, чтобы Product не был без image).
 */
function absoluteProductImageUrl(product) {
  const img = product?.image;
  if (!img || typeof img !== 'string') {
    return `${siteUrl}/logo_techno_bar.svg`;
  }
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }
  return img.startsWith('/') ? `${siteUrl}${img}` : `${siteUrl}/${img}`;
}

/** Текст description для Product в JSON-LD (страница товара и списки на категориях). */
function productDescriptionForSchema(product, options = {}) {
  if (options.description) return options.description;
  const nameIn = options.nameIn || 'Минске';
  return (
    product?.description ||
    `Купить ${product.name} в ${nameIn} с доставкой. Купить в рассрочку — без переплат.`
  );
}

/** Brand для Product — нужен в списках категорий, иначе GSC: «нет GTIN / бренда». */
function productBrandForSchema(product) {
  return {
    '@type': 'Brand',
    name: product?.specifications?.brand || 'Texnobar',
  };
}

/**
 * Offer для schema.org Product — поля, которые ожидает Google (иначе «нет offers» в Search Console).
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
function buildProductOffer(product, productId, options = {}) {
  const pricedProduct = product?.id ? product : { ...product, id: productId };
  const productUrl = options.url || `${siteUrl}${options.pathPrefix || ''}${productPublicPath(pricedProduct)}`;
  const fullPrice = Number(product?.totalPrice ?? product?.total_price);
  const salePrice = Number.isFinite(fullPrice) && fullPrice > 0 ? fullPrice : null;
  const availability =
    (product?.availabilityStatus || product?.availability_status) === 'on_order'
      ? 'https://schema.org/PreOrder'
      : 'https://schema.org/InStock';

  return {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'BYN',
    // `price` в каталоге — платёж в месяц. В Offer попадает только полная цена из total_price.
    ...(salePrice !== null
      ? { price: salePrice, priceValidUntil: priceValidUntilIso(365) }
      : {}),
    availability,
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Texnobar',
      url: siteUrl,
    },
    hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
    shippingDetails: buildOfferShippingDetails(options.shippingRate),
  };
}

/** Rating is included only when the product record actually has rating and review count. */
function buildProductAggregateRating(product) {
  const rawReviews = product?.reviewsCount ?? product?.reviewCount;
  const rawRating = product?.ratingValue ?? product?.rating;
  if (rawReviews === undefined || rawReviews === null || rawRating === undefined || rawRating === null) {
    return null;
  }
  const reviewCount = Math.max(1, Number(rawReviews) || 0);
  const ratingValue = Math.min(5, Math.max(1, Number(rawRating) || 0));
  if (!reviewCount || !ratingValue) return null;

  return {
    '@type': 'AggregateRating',
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: '5',
    worstRating: '1',
  };
}

/**
 * Generate Organization structured data
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Texnobar',
    alternateName: ['Технобар', 'Баратех', 'bartech'],
    legalName: 'ООО «Баратех»',
    taxID: '193796252',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo_techno_bar.svg`,
    },
    description:
      'Интернет-магазин техники в Минске. Купить в рассрочку телефоны, ноутбуки и бытовую технику без переплат с доставкой по Беларуси.',
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    sameAs: getBusinessSameAs(),
  };
}

/**
 * Generate LocalBusiness structured data — ключевой элемент для локального SEO по Минску.
 */
export function getLocalBusinessSchema(city) {
  const nameIn = city?.nameIn || 'Минске';
  const locality = city?.name || 'Минск';
  const showAddress = city?.publicFields?.address !== false && city?.publicFields?.street !== false;
  const hasPoint = showAddress && Boolean(city?.streetAddress && String(city.streetAddress).trim().length > 3);
  const hasGeo = city?.publicFields?.coordinates !== false && Number.isFinite(city?.latitude) && Number.isFinite(city?.longitude);
  const knownHours = city?.workHours === 'Понедельник–пятница, 9:00–21:00';
  const schema = {
    '@context': 'https://schema.org',
    '@type': hasPoint ? ['Store', 'ElectronicsStore'] : 'LocalBusiness',
    name: 'Texnobar',
    alternateName: ['Технобар', 'Баратех', 'bartech'],
    legalName: 'ООО «Баратех»',
    taxID: '193796252',
    url: city?.slug && city.slug !== 'minsk' ? `${siteUrl}/${city.slug}` : siteUrl,
    logo: `${siteUrl}/logo_techno_bar.svg`,
    image: `${siteUrl}/logo_techno_bar.svg`,
    description: `Интернет-магазин техники в ${nameIn}. Рассрочка, каталог и цены на technobar.by.`,
    areaServed: [
      { '@type': 'City', name: locality },
      ...(city?.regionName ? [{ '@type': 'AdministrativeArea', name: city.regionName }] : []),
      { '@type': 'Country', name: 'Беларусь' },
    ],
    currenciesAccepted: 'BYN',
    sameAs: getBusinessSameAs(),
  };

  if (hasPoint) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: city.streetAddress,
      addressLocality: locality,
      ...(city.postalCode && city?.publicFields?.postal !== false ? { postalCode: city.postalCode } : {}),
      addressCountry: 'BY',
    };
  }
  if (hasGeo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: city.latitude,
      longitude: city.longitude,
    };
  }
  if (city?.phoneTel) schema.telephone = city.phoneTel;
  if (city?.email) schema.email = city.email;
  if (knownHours) {
    schema.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '21:00',
      },
    ];
  }

  return schema;
}

/**
 * Generate Product structured data
 */
export function getProductSchema(product, options = {}) {
  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => ({
          '@type': 'ImageObject',
          url:
            img.startsWith('http') ? img : `${siteUrl}${img.startsWith('/') ? img : `/${img}`}`,
        }))
      : product.image
        ? [
            {
              '@type': 'ImageObject',
              url: absoluteProductImageUrl(product),
            },
          ]
        : [];

  const imageUrls =
    images.length > 0
      ? images.map((img) => img.url)
      : [absoluteProductImageUrl(product)];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: options.description || productDescriptionForSchema(product, options),
    image: imageUrls,
    sku: String(product.id),
    brand: productBrandForSchema(product),
    offers: buildProductOffer(product, product.id, options),
  };

  const aggregateRating = buildProductAggregateRating(product);
  if (aggregateRating) {
    schema.aggregateRating = aggregateRating;
  }

  // Добавляем спецификации если они есть
  if (product.specifications) {
    const additionalProperty = [];

    Object.entries(product.specifications).forEach(([key, value]) => {
      if (value && key !== 'brand') {
        additionalProperty.push({
          '@type': 'PropertyValue',
          name: key,
          value: String(value),
        });
      }
    });

    if (additionalProperty.length > 0) {
      schema.additionalProperty = additionalProperty;
    }
  }

  return schema;
}

/**
 * Generate BreadcrumbList structured data
 */
export function getBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Texnobar',
    description:
      'Интернет-магазин Texnobar (technobar.by): купить в рассрочку телефон, смартфон, телевизор, ноутбук и технику в Минске — доставка по Беларуси, каталог с ценами, рассрочка без переплат.',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate CollectionPage structured data for categories
 */
export function getCollectionPageSchema(category, products, numberOfItems, options = {}) {
  if (!category) return null;

  const count =
    typeof numberOfItems === 'number' ? numberOfItems : products?.length || 0;
  const seo = getCategorySeoCopy(category);
  const desc =
    seo.description.length > 320
      ? `${seo.description.slice(0, 317)}...`
      : seo.description;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: desc,
    url: `${siteUrl}${options.pathPrefix || ''}${categoryPublicPath(category.id)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: count,
      itemListElement:
        products?.slice(0, 10).map((product, index) => {
          const aggregateRating = buildProductAggregateRating(product);
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: productDescriptionForSchema(product, options),
              sku: String(product.id),
              brand: productBrandForSchema(product),
              url: `${siteUrl}${options.pathPrefix || ''}${productPublicPath(product)}`,
              image: absoluteProductImageUrl(product),
              offers: buildProductOffer(product, product.id, options),
              ...(aggregateRating ? { aggregateRating } : {}),
            },
          };
        }) || [],
    },
  };
}

/**
 * FAQ structured data for the installment / рассрочка landing (targets «купить в рассрочку»).
 */
export function getInstallmentFaqSchema() {
  return getFaqPageSchema(INSTALLMENT_FAQ_ITEMS);
}

export function getHomeFaqSchema() {
  return getFaqPageSchema(HOME_FAQ_ITEMS);
}

/**
 * Standalone ItemList for category pages (complements CollectionPage schema).
 */
export function getCategoryItemListSchema(category, products, numberOfItems, options = {}) {
  if (!category) return null;

  const count =
    typeof numberOfItems === 'number' ? numberOfItems : products?.length || 0;
  const list = products?.slice(0, 12) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — каталог Texnobar`,
    description: getCategorySeoCopy(category).description,
    numberOfItems: count,
    itemListElement: list.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `${siteUrl}${options.pathPrefix || ''}${productPublicPath(product)}`,
    })),
  };
}

/**
 * AggregateRating + отзывы для страницы /reviews.
 * У вложенных в LocalBusiness.review объектов Review не указываем itemReviewed —
 * иначе валидатор Google (Rich Results) ругается: родитель и так задаёт объект отзыва.
 */
export function getAggregateRatingSchema(ratingValue = '4.8', reviewCount = '10') {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Texnobar',
    url: siteUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Александр Петров' },
        datePublished: '2024-01-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Отличный магазин! Купил iPhone 15 Pro в рассрочку, процесс оформления занял всего 15 минут. Телефон доставили уже на следующий день. Очень доволен сервисом!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Елена Соколова' },
        datePublished: '2024-01-10',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Оформила рассрочку на Samsung Galaxy S23, одобрили практически моментально. Ежемесячный платеж очень комфортный. Спасибо за отличный сервис!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Дмитрий Волков' },
        datePublished: '2024-01-05',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Второй раз покупаю телефон в этом магазине. Радует отсутствие первого взноса и быстрое оформление рассрочки. Рекомендую всем!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Марина Козлова' },
        datePublished: '2023-12-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Рассрочку одобрили быстро, условия выгодные. Телефон оригинальный, полная комплектация. Очень довольна!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Игорь Сидоров' },
        datePublished: '2023-12-20',
        reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
        reviewBody: 'Хороший магазин с адекватными ценами. Купил iPhone 13 в рассрочку. Процесс оформления простой и понятный. В целом, доволен покупкой.',
      },
    ],
  };
}
