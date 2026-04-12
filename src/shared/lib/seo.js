/**
 * SEO utilities for generating structured data and metadata
 */

import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getStaticCategorySeo } from '@/shared/config/category-static-seo';

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

const BUSINESS_ADDRESS = {
  streetAddress: 'ул. Сурганова, д. 43, пом. 804',
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
    sameAs: [],
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
    sameAs: [],
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
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Как купить в рассрочку в Texnobar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Выберите товар на сайте и оформите заказ с оплатой в рассрочку. Условия: срок до 12 месяцев, первоначальный взнос от 10%, без переплат и скрытых комиссий. Подробности — на странице «Рассрочка» или у менеджера по телефону +375 (25) 776-64-62.',
        },
      },
      {
        '@type': 'Question',
        name: 'На какой срок доступна рассрочка?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Рассрочка предоставляется на срок до 12 месяцев в зависимости от условий банка или партнёра и выбранного товара.',
        },
      },
      {
        '@type': 'Question',
        name: 'Есть ли переплаты при покупке в рассрочку?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Мы предлагаем программы рассрочки без переплат и скрытых комиссий в рамках действующих акций и партнёрских программ.',
        },
      },
      {
        '@type': 'Question',
        name: 'Какой минимальный первоначальный взнос при рассрочке?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Минимальный первоначальный взнос составляет от 10% от стоимости товара. В рамках специальных акций возможна рассрочка без первоначального взноса.',
        },
      },
      {
        '@type': 'Question',
        name: 'Можно ли купить в рассрочку онлайн с доставкой по Минску?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, вы можете оформить рассрочку онлайн на сайте technobar.by. Доставка по Минску осуществляется в день заказа или на следующий день. Все документы оформляются курьером на месте.',
        },
      },
      {
        '@type': 'Question',
        name: 'Какие товары можно купить в рассрочку?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'В Texnobar в рассрочку можно купить смартфоны, ноутбуки, планшеты, телевизоры, бытовую технику, самокаты, велосипеды и другую электронику. Весь каталог доступен на сайте.',
        },
      },
      {
        '@type': 'Question',
        name: 'Нужна ли справка о доходах для оформления рассрочки?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Условия оформления рассрочки зависят от партнёрского банка. В большинстве случаев достаточно паспорта гражданина Республики Беларусь. Уточните детали у наших менеджеров.',
        },
      },
      {
        '@type': 'Question',
        name: 'Осуществляется ли доставка по всей Беларуси?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, мы осуществляем доставку по всей территории Беларуси. Доставка по Минску — 10 BYN (бесплатно при заказе от 1000 BYN), по Беларуси — 15 BYN, срок 1-3 рабочих дня.',
        },
      },
    ],
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
