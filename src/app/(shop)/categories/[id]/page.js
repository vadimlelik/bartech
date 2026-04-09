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
  getCategorySeoCopy,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

// Кэш категорий и выборки товаров (~1 ч), снижает нагрузку на БД
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
  try {
    const categories = await getCategories();
    return categories.map((category) => ({
      id: category.id.toString(),
    }));
  } catch {
    // Сборка без доступной БД (Docker/CI) — страницы по id генерируются on-demand
    return [];
  }
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

    const seo = getCategorySeoCopy(category);

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.title.replace(' | Texnobar', ''),
        description: seo.description,
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
        title: seo.title.replace(' | Texnobar', ''),
        description: seo.description,
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

    const categorySeo = getCategorySeoCopy(category);

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
              {category.name} — купить в рассрочку в Минске
            </Typography>
            <Typography
              variant="body1"
              component="p"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 900 }}
            >
              {categorySeo.introParagraph}
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
