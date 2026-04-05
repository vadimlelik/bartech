import { getAllProducts } from '@/entities/product/model/products';
import { getCategories } from '@/entities/category/model/categories';
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
      url: `${siteUrl}/payment_delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

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
    console.error('Error fetching categories for sitemap:', error);
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
    console.error('Error fetching products for sitemap:', error);
  }

  return [...baseRoutes, ...categoryRoutes, ...productRoutes];
}

