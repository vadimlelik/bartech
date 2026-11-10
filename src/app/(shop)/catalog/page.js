import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { getCategories } from '@/entities/category/model/categories';
import { groupStoreCategories } from '@/shared/config/catalog-groups';
import CatalogBrowser from '@/widgets/catalog-menu/ui/CatalogBrowser';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Каталог техники в рассрочку',
  description:
    'Каталог Texnobar: смартфоны, телевизоры, ноутбуки и бытовая техника в рассрочку. Выберите категорию и смотрите цены.',
  alternates: {
    canonical: `${siteUrl}/catalog`,
  },
};

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  noStore();
  const categories = await getCategories();
  const groups = groupStoreCategories(categories);

  const catalogGroups = groups.map((group) => ({
    slug: group.slug,
    name: group.name,
    categories: group.categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image || null,
    })),
  }));

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, color: 'text.secondary', fontSize: '0.95rem' }}>
          <Link href="/">Главная</Link>
          <span>/</span>
          <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
            Каталог
          </Typography>
        </Box>
        <Typography
          component="h1"
          sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' }, mb: 1 }}
        >
          Каталог
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
          Выберите раздел слева — справа появятся категории и товары с платежом в месяц.
        </Typography>
        <CatalogBrowser groups={catalogGroups} />
      </Container>
    </Box>
  );
}
