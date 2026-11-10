import { Suspense } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ShopBreadcrumbs, shopTitleSx } from '@/shared/ui/shop-page/ShopPage';
import Link from 'next/link';
import { unstable_cache, unstable_noStore as noStore } from 'next/cache';
import ProductList from './ProductList';
import { getCategoryById } from '@/entities/category/model/categories';
import { getProducts } from '@/entities/product/model/products';
import { notFound, unstable_rethrow } from 'next/navigation';
import {
  getCollectionPageSchema,
  getCategoryItemListSchema,
  getBreadcrumbSchema,
  getCategorySeoCopy,
  getCategoryArticleParagraphs,
  getCategoryFaqItems,
  getFaqPageSchema,
  buildDefaultOpenGraphImages,
  DEFAULT_OG_IMAGE_PATH,
} from '@/shared/lib/seo';
import { JsonLd, SeoFaqSection } from '@/shared/ui/seo';
import { categoryPublicPath } from '@/shared/lib/category-path';
import { productPublicPath } from '@/shared/lib/product-path';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { findCatalogGroup } from '@/shared/config/catalog-groups';
import { getPageCity } from '@/entities/city/model/cities';
import { DEFAULT_CITY_SLUG, withCityPrefix } from '@/shared/config/city-routes';
import { buildRegionalCategoryCopy } from '@/shared/lib/city-seo';
import CityOfferBlock from '@/entities/city/ui/CityOfferBlock';

function cityPrefix(city) {
  if (!city || city.slug === DEFAULT_CITY_SLUG) return '';
  return `/${city.slug}`;
}

function isDefaultCity(city) {
  return !city || city.slug === DEFAULT_CITY_SLUG;
}

const PAGE_SIZE = 24;

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

function getCachedCategoryProductsFirstPage(categoryId) {
  return unstable_cache(
    async () => {
      return await getProducts({
        categoryId,
        page: 1,
        limit: PAGE_SIZE,
        sort: 'asc',
        sortBy: 'name',
      });
    },
    ['category-products-first-page', String(categoryId)],
    {
      revalidate: 3600,
      tags: ['products', 'categories'],
    },
  )();
}

// Как у товара: город берётся из заголовка запроса. revalidate заставлял Next
// собрать страницу без запроса, и на проде весь раздел /categories отдавал 500.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }) {
  noStore();
  const { id } = await params;
  const query = await searchParams;
  const hasFilters = query && Object.keys(query).some((key) => query[key]);
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
    const city = await getPageCity();
    if (!city) {
      return { title: 'Страница не найдена', robots: { index: false, follow: false } };
    }
    const prefix = cityPrefix(city);
    const regional = isDefaultCity(city) ? null : buildRegionalCategoryCopy(category, city);
    const title = regional ? regional.title : seo.title;
    const description = regional ? regional.description : seo.description;
    const canonical = `${siteUrl}${prefix}${categoryPublicPath(category.id)}`;

    return {
      title: { absolute: title },
      description,
      keywords: regional ? regional.keywords : seo.keywords,
      robots: hasFilters ? { index: false, follow: true } : undefined,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'ru_BY',
        siteName: 'Технобар',
        url: canonical,
        images: buildDefaultOpenGraphImages(category.name),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [DEFAULT_OG_IMAGE_PATH],
      },
      alternates: {
        canonical,
      },
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('Error generating category metadata:', error);
    return {
      title: 'Ошибка',
      description: 'Произошла ошибка при загрузке категории',
    };
  }
}

export default async function CategoryPage({ params }) {
  noStore();
  const { id } = await Promise.resolve(params);

  try {
    const category = await getCachedCategoryByIdCached(id);

    if (!category) {
      notFound();
    }

    const seoProductsResult = await getCachedCategorySeoSample(category.id);
  const city = await getPageCity();
  if (!city) notFound();
  const schemaOptions = { pathPrefix: cityPrefix(city), nameIn: city.nameIn || city.name };
    const collectionSchema = getCollectionPageSchema(
      category,
      seoProductsResult?.products || [],
      seoProductsResult?.pagination?.total ?? 0,
      schemaOptions,
    );
    const itemListSchema = getCategoryItemListSchema(
      category,
      seoProductsResult?.products || [],
      seoProductsResult?.pagination?.total ?? 0,
      schemaOptions,
    );

    const regionalCopy = isDefaultCity(city) ? null : buildRegionalCategoryCopy(category, city);
    const articleParagraphs = regionalCopy ? [] : getCategoryArticleParagraphs(category);
    const faqItems = getCategoryFaqItems(category);
    const faqSchema = getFaqPageSchema(faqItems);
    const firstPageProductsResult = await getCachedCategoryProductsFirstPage(category.id);
    const featuredProducts = (firstPageProductsResult?.products || []).slice(0, 12);

    // Breadcrumbs для категории
    const catalogGroup = findCatalogGroup(category.id);
    const breadcrumbs = [
      { name: 'Главная', url: withCityPrefix(city?.slug, '/') },
      { name: 'Каталог', url: '/catalog' },
      ...(catalogGroup
        ? [{ name: catalogGroup.name, url: `/catalog/${catalogGroup.slug}` }]
        : []),
      { name: category.name, url: withCityPrefix(city?.slug, categoryPublicPath(category.id)) },
    ];
    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

    return (
      <>
        <JsonLd data={collectionSchema} />
        <JsonLd data={itemListSchema} />
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={faqSchema} />
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, flex: 1 }}>
            <ShopBreadcrumbs items={breadcrumbs} />
            <Typography component="h1" sx={shopTitleSx}>
              {regionalCopy
                ? regionalCopy.h1
                : `${category.name} в рассрочку в ${city?.nameIn || 'Минске'}`}
            </Typography>
            {regionalCopy ? (
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 900 }}
              >
                {regionalCopy.intro}
              </Typography>
            ) : (
              <Box sx={{ mb: 3, maxWidth: 900 }}>
                {articleParagraphs.map((paragraph) => (
                  <Typography
                    key={paragraph.slice(0, 48)}
                    variant="body1"
                    component="p"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            )}
            {regionalCopy ? (
              <Box sx={{ mb: 4 }}>
                <CityOfferBlock city={city} />
              </Box>
            ) : null}
            <Suspense fallback={null}>
              <ProductList
                categoryId={category.id}
                initialProducts={firstPageProductsResult?.products || []}
                initialFilters={firstPageProductsResult?.filters || {}}
                initialHasMore={
                  (firstPageProductsResult?.pagination?.pages ?? 0) > 1
                }
              />
            </Suspense>
            {faqItems.length > 0 && (
              <Box sx={{ mt: 4, mb: 2, maxWidth: 900 }}>
                <SeoFaqSection
                  title={`Рассрочка на ${category.name.toLocaleLowerCase('ru')}`}
                  items={faqItems}
                />
              </Box>
            )}
            {featuredProducts.length > 0 && (
              <Box
                component="section"
                aria-label={`Популярные товары категории ${category.name}`}
                sx={{ mt: 5, mb: 2 }}
              >
                <Typography variant="h2" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
                  Популярные товары в категории {category.name}
                </Typography>
                <Box
                  component="details"
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography
                    component="summary"
                    variant="body1"
                    sx={{ cursor: 'pointer', fontWeight: 500 }}
                  >
                    Показать подборку популярных моделей с ценами и рассрочкой
                  </Typography>
                  <Box component="ul" sx={{ mt: 1.5, mb: 0, pl: 2.5 }}>
                    {featuredProducts.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={withCityPrefix(city?.slug, productPublicPath(product))}
                          title={`Купить ${product.name} в рассрочку в ${city?.nameIn || 'Минске'}`}
                          aria-label={`Купить ${product.name} в рассрочку в ${city?.nameIn || 'Минске'}`}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Container>
        </Box>
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    console.error('Error in CategoryPage:', error);
    throw error;
  }
}
