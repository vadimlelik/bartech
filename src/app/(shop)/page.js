import { Container, Grid, Typography, Box } from '@mui/material';
import CategoryCard from './components/CategoryCard';
import { getCategories } from '@/lib/categories';
import CategoryCarousel from '@/components/CategoryCarousel/CategoryCarousel';
import Features from '@/components/Features/Features';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bartech.by';

export const metadata = {
  title: 'Bartech - Интернет-магазин техники в Минске',
  description: 'Купить технику в Минске с доставкой. Широкий ассортимент телефонов, ноутбуков, телевизоров и другой электроники. Рассрочка без переплат.',
  keywords: [
    'техника',
    'электроника',
    'купить технику в минске',
    'телефоны',
    'ноутбуки',
    'телевизоры',
    'интернет-магазин',
    'рассрочка',
  ],
  openGraph: {
    title: 'Bartech - Интернет-магазин техники в Минске',
    description: 'Купить технику в Минске с доставкой. Широкий ассортимент телефонов, ноутбуков, телевизоров и другой электроники.',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/logo_techno_bar.svg`,
        width: 1200,
        height: 630,
        alt: 'Bartech - Интернет-магазин техники',
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function Home() {
  const categories = await getCategories();

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
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard category={category} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
