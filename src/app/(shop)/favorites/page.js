'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFavoritesStore } from '@/entities/favorites';
import { useCity } from '@/entities/city';
import {
  Container,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { shopTitleSx } from '@/shared/ui/shop-page/ShopPage';
import { CardSkeletonGrid, EmptyState } from '@/shared/ui/states/States';
import CatalogProductCard from '@/entities/product/ui/catalog-product-card/CatalogProductCard';

export default function FavoritesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { favorites } = useFavoritesStore();
  const { href } = useCity();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        if (!favorites || favorites.length === 0) {
          setProducts([]);
          return;
        }

        const chunkSize = 80;
        const chunks = [];
        for (let i = 0; i < favorites.length; i += chunkSize) {
          chunks.push(favorites.slice(i, i + chunkSize));
        }

        const responses = await Promise.all(
          chunks.map((ids) =>
            fetch(`/api/products?ids=${ids.join(',')}&limit=${chunkSize}`),
          ),
        );

        for (const response of responses) {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
        }

        const payloads = await Promise.all(
          responses.map((response) => response.json()),
        );

        const byId = new Map();
        for (const data of payloads) {
          for (const p of data.products || []) {
            if (p?.id !== undefined && p?.id !== null) {
              byId.set(String(p.id), p);
            }
          }
        }

        const ordered = favorites
          .map((id) => byId.get(String(id)))
          .filter(Boolean);
        setProducts(ordered);
      } catch (error) {
        setSnackbarMessage('Ошибка при загрузке товаров');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [favorites]);

  // Мемоизируем количество товаров
  const productsCount = useMemo(() => products.length, [products.length]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography component="h1" sx={shopTitleSx}>
          Избранное
        </Typography>
        <CardSkeletonGrid count={6} />
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography component="h1" sx={shopTitleSx}>
          Избранное
        </Typography>
        <EmptyState
          title="В избранном пока нет товаров"
          text="Отметьте сердечко на карточке, и товар появится здесь."
          actionHref={href('/catalog')}
          actionLabel="Перейти в каталог"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography component="h1" sx={shopTitleSx}>
        Избранное ({productsCount})
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => {
          if (!product.id) {
            return null;
          }
          return (
          <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
            <CatalogProductCard
              product={product}
              onFavoriteToggle={(item, next) => {
                if (!next) {
                  setSnackbarMessage('Товар удален из избранного');
                  setSnackbarOpen(true);
                }
              }}
            />
          </Grid>
          );
        })}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
