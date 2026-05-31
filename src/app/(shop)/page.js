import { unstable_noStore as noStore } from 'next/cache';
import { Container, Grid, Typography, Box, Stack } from '@mui/material';
import CategoryCard from '@/entities/category/ui/category-card/CategoryCard';
import { getCategories } from '@/entities/category/model/categories';
import CategoryCarousel from '@/entities/category/ui/category-carousel/CategoryCarousel';
import Features from '@/widgets/features-showcase/ui/Features';
import InstallmentFactsToggle from './ui/InstallmentFactsToggle';
import {
  SeoCitabilityPanel,
  SeoFaqSection,
  SeoTrustBar,
} from '@/shared/ui/seo';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
  COMMERCIAL_SEO_KEYWORDS,
  buildDefaultOpenGraphImages,
  getHomeFaqSchema,
  HOME_FAQ_ITEMS,
  HOME_CITABILITY_QUESTION,
  HOME_CITABILITY_ANSWER,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: {
    absolute:
      'Купить в рассрочку телефон, телевизор, ноутбук — Минск | Texnobar',
  },
  description:
    'Купить в рассрочку телефон, смартфон, телевизор, ноутбук и технику в Минске — интернет-магазин Texnobar (technobar.by). Рассрочка без переплат, доставка по Беларуси, каталог товаров с ценами.',
  keywords: COMMERCIAL_SEO_KEYWORDS,
  openGraph: {
    title: 'Купить в рассрочку телефон, телевизор, ноутбук — Минск | Texnobar',
    description:
      'Купить в рассрочку телефон, телевизор, ноутбук в Минске. Texnobar — доставка, рассрочка без переплат, каталог.',
    type: 'website',
    url: siteUrl,
    images: buildDefaultOpenGraphImages('Technobar - Интернет-магазин техники'),
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Главная не кешируется статически: при docker build нет DATABASE_URL, иначе в HTML
// попадает пустой список категорий («Категории пока не добавлены»), хотя /api/categories с БД работает.

export default async function Home() {
  noStore();
  const categories = await getCategories();

  // Фильтруем категории с валидным ID и названием
  const validCategories = categories.filter(
    (category) =>
      category &&
      category.id &&
      category.id.trim() !== '' &&
      category.name &&
      category.name.trim() !== ''
  );

  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const localBusinessSchema = getLocalBusinessSchema();
  const homeFaqSchema = getHomeFaqSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {homeFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
        />
      )}
      <Box component="main" sx={{ flex: 1 }}>
        <CategoryCarousel />
        <Features />
        <Container sx={{ py: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 1,
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Техника в рассрочку в Минске — без переплат
          </Typography>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.secondary',
              maxWidth: 720,
              mx: 'auto',
            }}
          >
            Купить телефон, телевизор или ноутбук в рассрочку — доставка по Минску и Беларуси, каталог товаров с ценами
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
            }}
          >
            Категории товаров
          </Typography>
          {validCategories.length > 0 ? (
            <Grid container spacing={3}>
              {validCategories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <CategoryCard category={category} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Категории пока не добавлены
            </Typography>
          )}
          <Stack spacing={3} sx={{ maxWidth: 900, mx: 'auto', mt: 6, mb: 2 }}>
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
          <InstallmentFactsToggle />
        </Container>
      </Box>
    </>
  );
}
