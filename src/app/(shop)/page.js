import { Container, Grid, Typography, Box } from '@mui/material';
import CategoryCard from '@/entities/category/ui/category-card/CategoryCard';
import { getCategories } from '@/entities/category/model/categories';
import CategoryCarousel from '@/entities/category/ui/category-carousel/CategoryCarousel';
import Features from '@/widgets/features-showcase/ui/Features';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  SEO_INSTALLMENT_PHRASES,
} from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Купить в рассрочку — Texnobar | Техника и телефоны в Минске',
  description:
    'Купить в рассрочку телефоны, ноутбуки и технику в Минске. Интернет-магазин Texnobar: доставка, рассрочка без переплат, большой каталог.',
  keywords: [
    ...SEO_INSTALLMENT_PHRASES,
    'техника',
    'электроника',
    'купить технику в минске',
    'телефоны',
    'ноутбуки',
    'телевизоры',
    'интернет-магазин',
  ],
  openGraph: {
    title: 'Купить в рассрочку — Texnobar | Техника и телефоны в Минске',
    description:
      'Купить в рассрочку телефоны, ноутбуки и технику в Минске. Доставка, рассрочка без переплат.',
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

// Кэшируем страницу на 1 час (3600 секунд) для снижения нагрузки на Supabase
// При необходимости обновить данные можно использовать revalidateTag('categories')
export const revalidate = 3600;

export default async function Home() {
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
      <Box component="main" sx={{ flex: 1 }}>
        <CategoryCarousel />
        <Features />
        <Container sx={{ py: 4 }}>
          <Typography
            variant="h4"
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
