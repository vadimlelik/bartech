import { Container, Typography, Box } from '@mui/material';
import { unstable_cache } from 'next/cache';
import BackButton from './BackButton';
import ProductList from './ProductList';
import { getCategories, getCategoryById } from '@/entities/category/model/categories';
import { getProducts } from '@/entities/product/model/products';
import { notFound } from 'next/navigation';
import {
  getCollectionPageSchema,
  getBreadcrumbSchema,
  SEO_INSTALLMENT_PHRASES,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

// Кэшируем запросы к Supabase на 1 час для снижения нагрузки
function getCachedCategoryByIdCached(id) {
  return unstable_cache(
    async () => {
      return await getCategoryById(id);
    },
    ['category-by-id', String(id)],
    {
      revalidate: 3600,
      tags: ['categories'],
    },
  )();
}

function getCachedCategorySeoSample(categoryId) {
  return unstable_cache(
    async () => {
      return await getProducts({
        categoryId,
        page: 1,
        limit: 10,
      });
    },
    ['category-seo-sample', String(categoryId)],
    {
      revalidate: 3600,
      tags: ['products', 'categories'],
    },
  )();
}

// Кэшируем страницу на 1 час
export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    id: category.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    if (!id) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    const category = await getCachedCategoryByIdCached(id);

    if (!category) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    const description = `Купить ${category.name.toLowerCase()} в Минске с доставкой. Купить в рассрочку — без переплат. Каталог ${category.name} в Texnobar.`;

    return {
      title: `${category.name} — купить в рассрочку в Минске | Texnobar`,
      description,
      keywords: [
        category.name,
        `купить ${category.name.toLowerCase()} в минске`,
        ...SEO_INSTALLMENT_PHRASES,
        'техника',
        'электроника',
        'интернет-магазин',
      ],
      openGraph: {
        title: `${category.name} — купить в рассрочку | Texnobar`,
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
        title: `${category.name} — купить в рассрочку | Texnobar`,
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
    const category = await getCachedCategoryByIdCached(id);

    if (!category) {
      notFound();
    }

    const seoProductsResult = await getCachedCategorySeoSample(category.id);
    const collectionSchema = getCollectionPageSchema(
      category,
      seoProductsResult?.products || [],
      seoProductsResult?.pagination?.total ?? 0,
    );

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
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(collectionSchema),
            }}
          />
        )}
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
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
