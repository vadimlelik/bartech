'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CatalogProductCard from '@/entities/product/ui/catalog-product-card/CatalogProductCard';
import { useCity } from '@/entities/city';
import { categoryPublicPath } from '@/shared/lib/category-path';
import { resolveHomeCards } from '@/entities/city/lib/city-content';
import { findCatalogGroup } from '@/shared/config/catalog-groups';

const PAGE_STEP = 4;

const HOME_BLOCKS = [
  { title: 'Электроника', slugs: ['smartphones', 'tv', 'computers'] },
  { title: 'Для дома', slugs: ['kitchen', 'home'] },
  { title: 'Для дачи и отдыха', slugs: ['garden', 'leisure'] },
];

function orderSections(sections) {
  const blocks = HOME_BLOCKS.map((block) => ({
    title: block.title,
    sections: sections.filter((section) => {
      const group = findCatalogGroup(section.id);
      return group && block.slugs.includes(group.slug);
    }),
  }));
  const used = new Set(blocks.flatMap((block) => block.sections.map((section) => section.id)));
  const rest = sections.filter((section) => !used.has(section.id));
  if (rest.length) blocks.push({ title: 'Другие категории', sections: rest });
  return blocks.filter((block) => block.sections.length > 0);
}

function CategoryTile({ category }) {
  const [imageSrc, setImageSrc] = useState(category.image || '/logo_techno_bar.svg');
  const { href } = useCity();

  return (
    <Paper
      component={Link}
      href={href(categoryPublicPath(category.id))}
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '12px',
        p: 1.5,
        height: '100%',
        bgcolor: '#fff',
        border: '1px solid #E1E5EB',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(31, 41, 51, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 72,
          bgcolor: '#eef2f6',
          borderRadius: 2,
          mb: 1,
        }}
      >
        <Image
          src={imageSrc}
          alt={category.name}
          fill
          sizes="120px"
          style={{ objectFit: 'contain', padding: 8 }}
          onError={() => setImageSrc('/logo_techno_bar.svg')}
        />
      </Box>
      <Typography
        component="span"
        sx={{
          fontSize: '0.8rem',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {category.name}
      </Typography>
    </Paper>
  );
}

export default function HomeCatalog({ categories, sections }) {
  const { href, commerceCity, pageCity } = useCity();
  const city = commerceCity || pageCity;
  const cards = resolveHomeCards(city);
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  const orderedBlocks = orderSections(sections);
  const orderedSections = orderedBlocks.flatMap((block) =>
    block.sections.map((section) => ({ ...section, blockTitle: block.title }))
  );
  const visibleSections = orderedSections.slice(0, visibleCount);
  const hasMore = visibleCount < orderedSections.length;
  const visibleBlocks = [];
  visibleSections.forEach((section) => {
    const last = visibleBlocks[visibleBlocks.length - 1];
    if (!last || last.title !== section.blockTitle) {
      visibleBlocks.push({ title: section.blockTitle, sections: [section] });
    } else {
      last.sections.push(section);
    }
  });

  return (
    <Box>
      <Container sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 2, md: 3 } }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Box sx={{ py: { xs: 1, md: 3 } }}>
              <Typography
                variant="h1"
                component="h1"
                suppressHydrationWarning
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.375rem' },
                  lineHeight: 1.25,
                  letterSpacing: 0,
                  mb: 2,
                  maxWidth: 640,
                }}
              >
                {cards.heroTitle}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  maxWidth: 460,
                  mb: 3,
                }}
              >
                {cards.heroText}
              </Typography>
              <Button
                component={Link}
                href={href('/catalog')}
                variant="contained"
                size="large"
                sx={{ px: 3 }}
              >
                Перейти в каталог
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'grid', gap: 1.5, height: '100%' }}>
              <Paper
                elevation={0}
                component={Link}
                href={href('/installment')}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  p: { xs: 2, md: 2.5 },
                  borderRadius: '16px',
                  bgcolor: '#E8F0FE',
                  border: '1px solid #E1E5EB',
                }}
              >
                <Typography component="p" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1.5 }}>
                  {cards.installmentTitle}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0 }}>
                  {cards.installmentPoints.map((point) => (
                    <Box
                      component="li"
                      key={point}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 500 }}
                    >
                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      {point}
                    </Box>
                  ))}
                </Box>
              </Paper>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Paper
                  elevation={0}
                  component={Link}
                  href={href('/sales')}
                  sx={{ p: 2, borderRadius: '16px', textDecoration: 'none', color: 'inherit', border: '1px solid #E1E5EB', minHeight: 96 }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{cards.salesTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">{cards.salesText}</Typography>
                </Paper>
                <Paper
                  elevation={0}
                  component={Link}
                  href={href('/payment_delivery')}
                  sx={{ p: 2, borderRadius: '16px', textDecoration: 'none', color: 'inherit', border: '1px solid #E1E5EB', minHeight: 96 }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{cards.deliveryTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">{cards.deliveryText}</Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container id="catalog" sx={{ py: { xs: 2, md: 3 }, scrollMarginTop: 88 }}>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 2 }}
        >
          Популярные категории
        </Typography>
        {categories.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
                lg: 'repeat(8, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            {categories.slice(0, 8).map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">Категории пока не добавлены</Typography>
        )}
      </Container>

      {visibleBlocks.map((block) => (
        <Container key={block.title} sx={{ py: { xs: 1.5, md: 2.5 } }}>
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 2 }}>
            {block.title}
          </Typography>
          {block.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                  {section.name}
                </Typography>
                <Box
                  component={Link}
                  href={href(categoryPublicPath(section.id))}
                  sx={{ color: 'primary.main', fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.95rem' }}
                >
                  Все товары
                </Box>
              </Box>
              <Grid container spacing={2}>
                {section.products.map((product) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                    <CatalogProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Container>
      ))}

      {hasMore && (
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setVisibleCount((count) => count + PAGE_STEP)}
          >
            Загрузить ещё
          </Button>
        </Container>
      )}
    </Box>
  );
}
