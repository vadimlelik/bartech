import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { Container, Box, Stack } from '@mui/material';
import { getCategories } from '@/entities/category/model/categories';
import { getAllProducts } from '@/entities/product/model/products';
import { toCatalogCard } from '@/entities/product/lib/pricing';
import HomeCatalog from '@/widgets/home-catalog/ui/HomeCatalog';
import InstallmentFactsToggle from './ui/InstallmentFactsToggle';
import {
  SeoCitabilityPanel,
  SeoFaqSection,
  SeoTrustBar,
  JsonLd,
  PriorityCategoryLinks,
} from '@/shared/ui/seo';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
  COMMERCIAL_SEO_KEYWORDS,
  buildDefaultOpenGraphImages,
  getHomeFaqSchema,
  getFaqPageSchema,
  HOME_FAQ_ITEMS,
  HOME_CITABILITY_QUESTION,
  HOME_CITABILITY_ANSWER,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getPageCity } from '@/entities/city/model/cities';
import { DEFAULT_CITY_SLUG } from '@/shared/config/city-routes';
import { buildRegionalHomeCopy } from '@/shared/lib/city-seo';
import { cityFaqItems } from '@/entities/city/lib/city-content';
import CityOfferBlock from '@/entities/city/ui/CityOfferBlock';

export async function generateMetadata() {
  const city = await getPageCity();
  if (!city) {
    return { title: 'Страница не найдена', robots: { index: false, follow: false } };
  }
  const nameIn = city.nameIn || 'Минске';
  const prefix = city.slug !== DEFAULT_CITY_SLUG ? `/${city.slug}` : '';
  const regional = city.slug !== DEFAULT_CITY_SLUG ? buildRegionalHomeCopy(city) : null;
  const title = regional
    ? regional.title
    : 'Техника в рассрочку в Минске — магазин Технобар';
  const description = regional
    ? regional.description
    : `Телефоны, ноутбуки и телевизоры в рассрочку в ${nameIn} и по Беларуси. До 12 месяцев, без переплат по акциям. Технобар.`;
  return {
    title: { absolute: title },
    description,
    keywords: regional ? undefined : COMMERCIAL_SEO_KEYWORDS,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ru_BY',
      siteName: 'Технобар',
      url: `${siteUrl}${prefix}`,
      images: buildDefaultOpenGraphImages('Технобар — интернет-магазин техники'),
    },
    alternates: {
      canonical: `${siteUrl}${prefix}`,
    },
  };
}

// Главная не кешируется статически: при docker build нет DATABASE_URL, иначе в HTML
// попадает пустой список категорий («Категории пока не добавлены»), хотя /api/categories с БД работает.

export default async function Home() {
  noStore();
  const city = await getPageCity();
  if (!city) notFound();
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  // Фильтруем категории с валидным ID и названием
  const validCategories = categories.filter(
    (category) =>
      category &&
      category.id &&
      category.id.trim() !== '' &&
      category.name &&
      category.name.trim() !== ''
  );

  const productsByCategory = new Map();
  for (const product of products || []) {
    const categoryId = product?.categoryId || product?.category_id;
    if (!categoryId) continue;
    const bucket = productsByCategory.get(categoryId) || [];
    if (bucket.length < 4) {
      const card = toCatalogCard(product);
      if (card) bucket.push(card);
    }
    productsByCategory.set(categoryId, bucket);
  }

  const catalogCategories = validCategories.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image || null,
  }));

  const catalogSections = catalogCategories
    .map((category) => ({
      id: category.id,
      name: category.name,
      products: productsByCategory.get(category.id) || [],
    }))
    .filter((section) => section.products.length > 0);

  const isDefaultCity = !city || city.slug === DEFAULT_CITY_SLUG;
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const localBusinessSchema = getLocalBusinessSchema(city);
  const homeFaqSchema = isDefaultCity ? getHomeFaqSchema() : getFaqPageSchema(cityFaqItems(city));

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={homeFaqSchema} />
      <Box component="main" sx={{ flex: 1 }}>
        {isDefaultCity ? (
          <Container sx={{ pt: { xs: 2, md: 3 } }}>
            <Box
              component="nav"
              aria-label="Техника в рассрочку"
              sx={{
                maxWidth: 900,
                mx: 'auto',
                '& ul': {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  pl: 2.5,
                  my: 1,
                },
                '& a': { color: 'primary.main' },
              }}
            >
              <Box component="p" sx={{ m: 0, fontWeight: 700 }}>
                Купить в рассрочку
              </Box>
              <PriorityCategoryLinks />
            </Box>
          </Container>
        ) : null}
        <HomeCatalog categories={catalogCategories} sections={catalogSections} />
        <Container sx={{ py: 4 }}>
          {isDefaultCity ? (
            <Stack spacing={3} sx={{ maxWidth: 900, mx: 'auto', mb: 2 }}>
              <SeoCitabilityPanel
                question={HOME_CITABILITY_QUESTION}
                answer={HOME_CITABILITY_ANSWER}
              />
              <SeoFaqSection
                title="Частые вопросы о рассрочке в Texnobar"
                items={HOME_FAQ_ITEMS}
              />
              <SeoTrustBar />
            </Stack>
          ) : (
            <Box sx={{ maxWidth: 900, mx: 'auto', mb: 2 }}>
              <CityOfferBlock city={city} />
            </Box>
          )}
          {isDefaultCity ? <InstallmentFactsToggle /> : null}
        </Container>
      </Box>
    </>
  );
}
