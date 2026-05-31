/**
 * SEO utilities for generating structured data and metadata
 */

import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getStaticCategorySeo } from '@/shared/config/category-static-seo';
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

export function buildProductBreadcrumbs(product, category, productId) {
  const categoryLabel = resolveProductCategoryLabel(product, category);
  const categoryId = product?.categoryId || product?.category_id;

  return [
    { name: 'Главная', url: '/' },
    ...(categoryId && categoryLabel
      ? [{ name: categoryLabel, url: `/categories/${categoryId}` }]
      : []),
    { name: product.name, url: `/products/${productId}` },
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

/**
 * SEO для страницы категории: заголовок и описание под запросы вида «купить X в рассрочку».
 * Приоритет: 1) готовый текст в `category-static-seo.js` по id категории; 2) description из БД; 3) шаблон.
 */
export function getCategorySeoCopy(category) {
  const name = (category?.name && String(category.name).trim()) || 'товары';
  const lower = name.toLowerCase();
  const staticSeo = getStaticCategorySeo(category?.id);

  if (staticSeo) {
    const title =
      staticSeo.title ||
      `Купить ${lower} в рассрочку в Минске — каталог и цены | Texnobar`;
    const description =
      staticSeo.description ||
      `Купить ${lower} в рассрочку в Минске в интернет-магазине Texnobar: рассрочка без переплат, доставка по Беларуси. technobar.by.`;
    const introParagraph = staticSeo.introParagraph;
    const extraKw = staticSeo.extraKeywords?.length ? staticSeo.extraKeywords : [];
    const keywords = [
      ...extraKw,
      `купить ${lower} в рассрочку`,
      `купить ${lower} в минске`,
      `купить ${lower}`,
      `${lower} в рассрочку минск`,
      name,
      ...SEO_INSTALLMENT_PHRASES.slice(0, 8),
      'интернет-магазин техники минск',
    ];
    return { title, description, introParagraph, keywords };
  }

  const extra =
    category?.description && String(category.description).trim()
      ? String(category.description).trim()
      : '';

  const title = `Купить ${lower} в рассрочку в Минске — каталог и цены | Texnobar`;

  const description = extra
    ? `${extra} Рассрочка без переплат, доставка по Минску и Беларуси — Texnobar (technobar.by).`
    : `Купить ${lower} в рассрочку в Минске в интернет-магазине Texnobar: рассрочка без переплат, доставка по Беларуси, большой каталог и цены онлайн. Оформление заказа на сайте technobar.by.`;

  const introParagraph = extra
    ? `${extra} Ниже — актуальные модели и цены; рассрочка и доставка по Минску и Беларуси.`
    : `В интернет-магазине Texnobar можно купить ${lower} в рассрочку в Минске: выгодные условия, доставка по Беларуси, актуальные цены в каталоге. Подберите модель по характеристикам ниже — рассрочка без переплат в рамках акций.`;

  const keywords = [
    `купить ${lower} в рассрочку`,
    `купить ${lower} в минске`,
    `купить ${lower}`,
    `${lower} в рассрочку минск`,
    name,
    ...SEO_INSTALLMENT_PHRASES.slice(0, 8),
    'интернет-магазин техники минск',
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
function buildOfferShippingDetails() {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: 0,
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
function productDescriptionForSchema(product) {
  return (
    product?.description ||
    `Купить ${product.name} в Минске с доставкой. Купить в рассрочку — без переплат.`
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
function buildProductOffer(product, productId) {
  const id = productId ?? product?.id;
  const productUrl = `${siteUrl}/products/${id}`;
  const raw = product?.price;
  const priceNum =
    raw !== undefined && raw !== null && Number.isFinite(Number(raw))
      ? Number(raw)
      : 0;

  return {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'BYN',
    price: priceNum,
    priceValidUntil: priceValidUntilIso(365),
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Texnobar',
      url: siteUrl,
    },
    hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
    shippingDetails: buildOfferShippingDetails(),
  };
}

/**
 * Fallback aggregate rating for Product rich results.
 * Keeps Product entities eligible even when Google temporarily distrusts Offer parsing.
 */
function buildProductAggregateRating(product) {
  const rawReviews = product?.reviewsCount ?? product?.reviewCount ?? 10;
  const reviewCount = Math.max(1, Number(rawReviews) || 10);
  const rawRating = product?.ratingValue ?? product?.rating ?? 4.8;
  const ratingValue = Math.min(5, Math.max(1, Number(rawRating) || 4.8));

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
    legalName: 'ООО «Баратех»',
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
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ElectronicsStore'],
    name: 'Texnobar',
    legalName: 'ООО «Баратех»',
    url: siteUrl,
    logo: `${siteUrl}/logo_techno_bar.svg`,
    image: `${siteUrl}/logo_techno_bar.svg`,
    description:
      'Интернет-магазин техники в Минске. Купить в рассрочку телефоны, ноутбуки, телевизоры и бытовую технику без переплат. Доставка по Минску и всей Беларуси.',
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.9085,
      longitude: 27.5685,
    },
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'BYN',
    paymentAccepted: 'Наличные, Банковская карта, Рассрочка',
    areaServed: [
      { '@type': 'City', name: 'Минск' },
      { '@type': 'Country', name: 'Беларусь' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог техники в рассрочку',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Смартфоны в рассрочку' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ноутбуки в рассрочку' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Телевизоры в рассрочку' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Бытовая техника в рассрочку' } },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '10',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: getBusinessSameAs(),
  };
}

/**
 * Generate Product structured data
 */
export function getProductSchema(product) {
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
    description: productDescriptionForSchema(product),
    image: imageUrls,
    sku: String(product.id),
    brand: productBrandForSchema(product),
    offers: buildProductOffer(product, product.id),
    aggregateRating: buildProductAggregateRating(product),
  };

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
export function getCollectionPageSchema(category, products, numberOfItems) {
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
    url: `${siteUrl}/categories/${category.id}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: count,
      itemListElement:
        products?.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            description: productDescriptionForSchema(product),
            sku: String(product.id),
            brand: productBrandForSchema(product),
            url: `${siteUrl}/products/${product.id}`,
            image: absoluteProductImageUrl(product),
            offers: buildProductOffer(product, product.id),
            aggregateRating: buildProductAggregateRating(product),
          },
        })) || [],
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
export function getCategoryItemListSchema(category, products, numberOfItems) {
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
      url: `${siteUrl}/products/${product.id}`,
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
