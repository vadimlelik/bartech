import { getAllProducts } from '@/entities/product/model/products';
import { getCategories } from '@/entities/category/model/categories';
import { logDbFallbackUnlessBuildWithoutDb } from '@/shared/lib/prisma-build-log';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { LANDING_SITEMAP_PRIORITIES } from '@/shared/config/subdomains';

export default async function sitemap() {
  const baseRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/installment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/payment_delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${siteUrl}/return`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/sales`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/guarantee`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/pk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/po`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/pass`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];

  // Статические лендинги по категориям товаров
  const landingRoutes = Object.entries(LANDING_SITEMAP_PRIORITIES).map(([slug, priority]) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }));

  // Получаем категории
  let categoryRoutes = [];
  try {
    const categories = await getCategories();
    categoryRoutes = categories.map((category) => ({
      url: `${siteUrl}/categories/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    logDbFallbackUnlessBuildWithoutDb('Error fetching categories for sitemap:', error);
  }

  // Получаем продукты
  let productRoutes = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((product) => ({
      url: `${siteUrl}/products/${product.id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    logDbFallbackUnlessBuildWithoutDb('Error fetching products for sitemap:', error);
  }

  return [...baseRoutes, ...landingRoutes, ...categoryRoutes, ...productRoutes];
}
