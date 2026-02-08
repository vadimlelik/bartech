/**
 * SEO utilities for generating structured data and metadata
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technobar.by';

/**
 * Generate Organization structured data
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Technobar',
    url: siteUrl,
    logo: `${siteUrl}/logo_techno_bar.svg`,
    description: 'Интернет-магазин техники в Минске',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BY',
      addressLocality: 'Минск',
    },
    sameAs: [
      // Добавьте ссылки на социальные сети при наличии
    ],
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
          url: img.startsWith('http') ? img : `${siteUrl}${img}`,
        }))
      : product.image
        ? [
            {
              '@type': 'ImageObject',
              url: product.image.startsWith('http')
                ? product.image
                : `${siteUrl}${product.image}`,
            },
          ]
        : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description || `Купить ${product.name} в Минске с доставкой`,
    image: images.map((img) => img.url),
    sku: String(product.id),
    brand: {
      '@type': 'Brand',
      name: product.specifications?.brand || 'Technobar',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'BYN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Technobar',
      },
    },
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
    name: 'technobar',
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
export function getCollectionPageSchema(category, products) {
  if (!category) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: `Купить ${category.name.toLowerCase()} в Минске с доставкой`,
    url: `${siteUrl}/categories/${category.id}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products?.length || 0,
      itemListElement:
        products?.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            url: `${siteUrl}/products/${product.id}`,
            image: product.image?.startsWith('http')
              ? product.image
              : `${siteUrl}${product.image}`,
          },
        })) || [],
    },
  };
}
