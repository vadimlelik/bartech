import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { getProducts } from '@/entities/product/model/products';
import { toCatalogCard } from '@/entities/product/lib/pricing';
import CatalogProductCard from '@/entities/product/ui/catalog-product-card/CatalogProductCard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Поиск по каталогу',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  noStore();
  const params = await searchParams;
  const query = String(params?.q || '').trim();
  const result = query
    ? await getProducts({
        search: query,
        page: 1,
        limit: 24,
        sortBy: 'name',
        sort: 'asc',
        prioritizeInStock: true,
      })
    : { products: [] };
  const products = (result.products || []).map(toCatalogCard).filter(Boolean);

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, color: 'text.secondary' }}>
          <Link href="/">Главная</Link>
          <span>/</span>
          <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
            Поиск
          </Typography>
        </Box>
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' }, mb: 1 }}>
          {query ? `Результаты по запросу «${query}»` : 'Поиск по каталогу'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {query
            ? products.length > 0
              ? `Найдено ${result.pagination?.total || products.length}`
              : 'Ничего не найдено. Попробуйте другое название.'
            : 'Введите название товара в строке поиска.'}
        </Typography>
        {query && products.length === 0 ? (
          <Button component={Link} href="/catalog" variant="contained">
            Перейти в каталог
          </Button>
        ) : null}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {products.map((product) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
              <CatalogProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
