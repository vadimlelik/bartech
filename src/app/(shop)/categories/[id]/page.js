import { Container, Typography, Box } from '@mui/material';
import { unstable_cache } from 'next/cache';
import BackButton from './BackButton';
import ProductList from './ProductList';
import { getCategoryById } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';
import { notFound } from 'next/navigation';
import { getCollectionPageSchema, getBreadcrumbSchema } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bartech.by';

// Кэшируем запросы к Supabase на 1 час для снижения нагрузки
const getCachedCategoryById = unstable_cache(
  async (id) => {
    return await getCategoryById(id);
  },
  ['category-by-id'],
  {
    revalidate: 3600,
    tags: ['categories'],
  }
);

const getCachedProductsByCategory = unstable_cache(
  async (categoryId) => {
    return await getProductsByCategory(categoryId);
  },
  ['products-by-category'],
  {
    revalidate: 3600,
    tags: ['products', 'categories'],
  }
);

// Кэшируем страницу на 1 час
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  try {
    if (!id) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    const category = await getCachedCategoryById(id);

    if (!category) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    const description = `Купить ${category.name.toLowerCase()} в Минске с доставкой. Широкий ассортимент товаров в категории ${category.name}. Рассрочка без переплат.`;

    return {
      title: `${category.name} - Купить в Bartech`,
      description,
      keywords: [
        category.name,
        `купить ${category.name.toLowerCase()} в минске`,
        'техника',
        'электроника',
        'интернет-магазин',
      ],
      openGraph: {
        title: `${category.name} - Купить в Bartech`,
        description,
        type: 'website',
        url: `${siteUrl}/categories/${id}`,
        images: [
          {
            url: `${siteUrl}/logo_techno_bar.svg`,
            width: 1200,
            height: 630,
            alt: category.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} - Купить в Bartech`,
        description,
        images: [`${siteUrl}/logo_techno_bar.svg`],
      },
      alternates: {
        canonical: `${siteUrl}/categories/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Ошибка',
      description: 'Произошла ошибка при загрузке категории',
    };
  }
}

export default async function CategoryPage({ params }) {
  const { id } = await Promise.resolve(params);

  try {
    const category = await getCachedCategoryById(id);

    if (!category) {
      notFound();
    }

    // Получаем продукты для структурированных данных
    const products = await getCachedProductsByCategory(category.id);
    const collectionSchema = getCollectionPageSchema(category, products);
    
    // Breadcrumbs для категории
    const breadcrumbs = [
      { name: 'Главная', url: '/' },
      { name: category.name, url: `/categories/${id}` },
    ];
    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

    return (
      <>
        {collectionSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
          />
        )}
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            <BackButton />
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
              {category.name}
            </Typography>
            <ProductList categoryId={category.id} />
          </Container>
        </Box>
      </>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    throw error;
  }
}
