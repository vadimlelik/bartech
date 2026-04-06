import { getAllProducts } from '@/entities/product/model/products';
import { getCategories } from '@/entities/category/model/categories';
import { logDbFallbackUnlessBuildWithoutDb } from '@/shared/lib/prisma-build-log';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

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
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Статические лендинги по категориям товаров
  const landingRoutes = [
    // Телефоны и смартфоны
    { slug: 'phone', priority: 0.85 },
    { slug: 'phone2', priority: 0.75 },
    { slug: 'phone3', priority: 0.75 },
    { slug: 'phone4', priority: 0.75 },
    { slug: 'phone5', priority: 0.75 },
    { slug: 'phone6', priority: 0.75 },
    { slug: 'shockproof-phone', priority: 0.7 },
    // Ноутбуки и компьютеры
    { slug: 'laptop', priority: 0.85 },
    { slug: 'laptop2', priority: 0.75 },
    { slug: 'pc', priority: 0.75 },
    // Телевизоры
    { slug: 'tv1', priority: 0.85 },
    { slug: 'tv2', priority: 0.75 },
    { slug: 'tv3', priority: 0.75 },
    // Электротранспорт
    { slug: 'scooter', priority: 0.75 },
    { slug: 'bicycles', priority: 0.75 },
    { slug: 'motoblok', priority: 0.7 },
    { slug: 'motoblok1', priority: 0.65 },
    { slug: 'motoblok2', priority: 0.65 },
    // Мобильный интернет
    { slug: 'mobile_1', priority: 0.65 },
    { slug: 'mobile_2', priority: 0.65 },
  ].map(({ slug, priority }) => ({
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
