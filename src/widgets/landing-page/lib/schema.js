import { getOrganizationSchema } from '@/shared/lib/seo';
import { getLandingSubdomainUrl } from '@/shared/lib/landing-seo';
import { buildLandingView } from './content';

/**
 * @param {string} value
 */
function jsonSafe(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * @param {string | undefined} src
 * @param {string} pageUrl
 */
function absoluteImage(src, pageUrl) {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) {
    try {
      return new URL(src, pageUrl).toString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * @param {unknown} landing
 * @param {string} slug
 */
export function buildLandingStructuredData(landing, slug) {
  const view = buildLandingView(landing);
  const pageUrl = getLandingSubdomainUrl(slug);
  const image = absoluteImage(view.mainImage, pageUrl);
  const organization = getOrganizationSchema();
  delete organization['@context'];

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: organization.url },
      { '@type': 'ListItem', position: 2, name: view.headline, item: pageUrl },
    ],
  };

  /** @type {Record<string, unknown>} */
  const webPage = {
    '@type': 'WebPage',
    name: view.headline,
    description: view.description || view.headline,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: 'Texnobar', url: organization.url },
    publisher: { '@id': `${organization.url}#organization` },
  };
  if (image) {
    webPage.primaryImageOfPage = { '@type': 'ImageObject', url: image };
  }

  const reviewEntities = view.reviews
    .filter((review) => review.text)
    .map((review) => {
      /** @type {Record<string, unknown>} */
      const entity = {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author || 'Покупатель',
        },
        reviewBody: review.text,
        itemReviewed: { '@type': 'WebPage', name: view.headline, url: pageUrl },
      };
      if (review.rating > 0) {
        entity.reviewRating = {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        };
      }
      return entity;
    });

  if (view.rating.average !== null && view.rating.ratedCount > 0) {
    webPage.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: view.rating.average,
      reviewCount: view.rating.ratedCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (reviewEntities.length > 0) {
    webPage.review = reviewEntities;
  }

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: view.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...organization, '@id': `${organization.url}#organization` },
      webPage,
      faqPage,
      breadcrumb,
    ].filter(Boolean),
  };
}

/**
 * @param {unknown} landing
 * @param {string} slug
 */
export function landingJsonLd(landing, slug) {
  return jsonSafe(buildLandingStructuredData(landing, slug));
}

/**
 * @param {string | null | undefined} src
 * @param {string} pageUrl
 */
export function landingShareImage(src, pageUrl) {
  return absoluteImage(src, pageUrl);
}
