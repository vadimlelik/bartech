import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import { getCategories } from '@/entities/category/model/categories';
import { CATALOG_GROUPS, groupStoreCategories } from '@/shared/config/catalog-groups';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { categoryPublicPath } from '@/shared/lib/category-path';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [...CATALOG_GROUPS.map((group) => ({ group: group.slug })), { group: 'other' }];
}

export async function generateMetadata({ params }) {
  const { group: slug } = await params;
  const categories = await getCategories();
  const group = groupStoreCategories(categories).find((item) => item.slug === slug);
  if (!group) {
    return { title: 'Раздел не найден' };
  }

  return {
    title: `${group.name} в рассрочку`,
    description: `${group.name} в каталоге Texnobar: ${group.categories.map((category) => category.name).join(', ')}. Рассрочка и доставка по Беларуси.`,
    alternates: {
      canonical: `${siteUrl}/catalog/${slug}`,
    },
  };
}

export default async function CatalogGroupPage({ params }) {
  noStore();
  const { group: slug } = await params;
  const categories = await getCategories();
  const group = groupStoreCategories(categories).find((item) => item.slug === slug);

  if (!group) {
    notFound();
  }

  const count = group.categories.length;
  const countMod10 = count % 10;
  const countMod100 = count % 100;
  const countLabel =
    countMod10 === 1 && countMod100 !== 11
      ? `${count} категория`
      : countMod10 >= 2 && countMod10 <= 4 && (countMod100 < 12 || countMod100 > 14)
        ? `${count} категории`
        : `${count} категорий`;

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, color: 'text.secondary' }}>
          <Link href="/">Главная</Link>
          <span>/</span>
          <Link href="/catalog">Каталог</Link>
          <span>/</span>
          <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
        </Box>
        <Typography
          component="h1"
          sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' }, mb: 1 }}
        >
          {group.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {countLabel} в этом разделе.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {group.categories.map((category) => (
            <Box
              key={category.id}
              component={Link}
              href={categoryPublicPath(category.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                minHeight: 180,
                bgcolor: '#fff',
                borderRadius: 3,
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 96,
                  bgcolor: '#eef2f6',
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                }}
              >
                {category.image ? (
                  <Box
                    component="img"
                    src={category.image}
                    alt=""
                    sx={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 800, color: 'text.disabled' }}>
                    {category.name.slice(0, 1)}
                  </Typography>
                )}
              </Box>
              <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{category.name}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
