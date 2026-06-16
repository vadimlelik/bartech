import { unstable_noStore as noStore } from 'next/cache';
import { getAllProducts } from '@/entities/product/model/products';
import { getCategories } from '@/entities/category/model/categories';
import { getAllLandings } from '@/entities/landing/model/landings-db';
import { logDbFallbackUnlessBuildWithoutDb } from '@/shared/lib/prisma-build-log';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { LANDING_SITEMAP_PRIORITIES } from '@/shared/config/subdomains';
import { isIndexedLanding } from '@/shared/lib/landing-seo';

// Не кешировать при сборке Docker (без DATABASE_URL) — категории и товары только из runtime БД
export const dynamic = 'force-dynamic';

const now = () => new Date();

function safeLastModified(value) {
  if (!value) {
    return now();
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? now() : date;
}

function safePathSegment(value) {
  return encodeURIComponent(String(value));
}

function isValidLandingSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug || ''));
}

function createSitemapEntry(path, options = {}) {
  return {
    url: `${siteUrl}${path}`,
    lastModified: safeLastModified(options.lastModified),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default async function sitemap() {
  noStore();
  const baseRoutes = [
    {
      url: siteUrl,
      lastModified: now(),
      changeFrequency: 'daily',
      priority: 1,
    },
    createSitemapEntry('/installment', { changeFrequency: 'weekly', priority: 0.95 }),
    createSitemapEntry('/reviews', { changeFrequency: 'weekly', priority: 0.8 }),
    createSitemapEntry('/payment_delivery', { changeFrequency: 'monthly', priority: 0.75 }),
    createSitemapEntry('/contacts', { changeFrequency: 'monthly', priority: 0.75 }),
    createSitemapEntry('/return', { changeFrequency: 'monthly', priority: 0.5 }),
    createSitemapEntry('/sales', { changeFrequency: 'weekly', priority: 0.7 }),
    createSitemapEntry('/service', { changeFrequency: 'monthly', priority: 0.5 }),
    createSitemapEntry('/guarantee', { changeFrequency: 'monthly', priority: 0.5 }),
    createSitemapEntry('/pk', { changeFrequency: 'monthly', priority: 0.3 }),
    createSitemapEntry('/po', { changeFrequency: 'monthly', priority: 0.3 }),
  ];

  // Статические лендинги по категориям товаров
  const landingRoutes = Object.entries(LANDING_SITEMAP_PRIORITIES).map(([slug, priority]) =>
    createSitemapEntry(`/${safePathSegment(slug)}`, {
      changeFrequency: 'weekly',
      priority,
    }),
  );

  const landingSlugs = new Set(Object.keys(LANDING_SITEMAP_PRIORITIES));
  try {
    const adminLandings = await getAllLandings();
    adminLandings
      .filter((landing) => landing?.is_active)
      .filter((landing) => isValidLandingSlug(landing.slug))
      .filter((landing) => isIndexedLanding(landing.slug))
      .filter((landing) => !landingSlugs.has(landing.slug))
      .forEach((landing) => {
        landingSlugs.add(landing.slug);
        landingRoutes.push(
          createSitemapEntry(`/${safePathSegment(landing.slug)}`, {
            lastModified: landing.updated_at || landing.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
          }),
        );
      });
  } catch (error) {
    logDbFallbackUnlessBuildWithoutDb('Error fetching admin landings for sitemap:', error);
  }

  // Получаем категории
  let categoryRoutes = [];
  try {
    const categories = await getCategories();
    categoryRoutes = categories
      .filter((category) => category?.id !== null && category?.id !== undefined)
      .map((category) =>
        createSitemapEntry(`/categories/${safePathSegment(category.id)}`, {
          lastModified: category.updated_at || category.updatedAt,
          changeFrequency: 'daily',
          priority: 0.9,
        }),
      );
  } catch (error) {
    logDbFallbackUnlessBuildWithoutDb('Error fetching categories for sitemap:', error);
  }

  // Получаем продукты
  let productRoutes = [];
  try {
    const products = await getAllProducts();
    productRoutes = products
      .filter((product) => product?.id !== null && product?.id !== undefined)
      .map((product) =>
        createSitemapEntry(`/products/${safePathSegment(product.id)}`, {
          lastModified: product.updated_at || product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        }),
      );
  } catch (error) {
    logDbFallbackUnlessBuildWithoutDb('Error fetching products for sitemap:', error);
  }

  return [...baseRoutes, ...landingRoutes, ...categoryRoutes, ...productRoutes];
}
