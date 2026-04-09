import { unstable_noStore as noStore } from 'next/cache';
import { Container, Grid, Typography, Box } from '@mui/material';
import CategoryCard from '@/entities/category/ui/category-card/CategoryCard';
import { getCategories } from '@/entities/category/model/categories';
import CategoryCarousel from '@/entities/category/ui/category-carousel/CategoryCarousel';
import Features from '@/widgets/features-showcase/ui/Features';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
  COMMERCIAL_SEO_KEYWORDS,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Купить в рассрочку телефон, телевизор, ноутбук — Минск | Texnobar',
  description:
    'Купить в рассрочку телефон, смартфон, телевизор, ноутбук и технику в Минске — интернет-магазин Texnobar (technobar.by). Рассрочка без переплат, доставка по Беларуси, каталог товаров с ценами.',
  keywords: COMMERCIAL_SEO_KEYWORDS,
  openGraph: {
    title: 'Купить в рассрочку телефон, телевизор, ноутбук — Минск | Texnobar',
    description:
      'Купить в рассрочку телефон, телевизор, ноутбук в Минске. Texnobar — доставка, рассрочка без переплат, каталог.',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/logo_techno_bar.svg`,
        width: 1200,
        height: 630,
        alt: 'Technobar - Интернет-магазин техники',
      },
    ],
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
              maxWidth: 600,
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
        </Container>
      </Box>
    </>
  );
}
