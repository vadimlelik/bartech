'use client';

import { useState, useEffect } from 'react';
import { useFavoritesStore } from '@/store/favorites';
import { useCartStore } from '@/store/cart';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { favorites, removeFromFavorites } = useFavoritesStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        if (!favorites || favorites.length === 0) {
          setProducts([]);
          return;
        }

        'Favorites from store:', favorites;
        const response = await fetch(
          `/api/products?ids=${favorites.join(',')}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        'Products from API:', data.products;
        setProducts(data.products || []);
      } catch (error) {
        setSnackbarMessage('Ошибка при загрузке товаров');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [favorites]);

  const handleRemoveFromFavorites = (productId) => {
    removeFromFavorites(productId);
    setSnackbarMessage('Товар удален из избранного');
    setSnackbarOpen(true);
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product);
    setSnackbarMessage('Товар добавлен в корзину');
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          В избранном пока нет товаров
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Перейти к покупкам
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Избранное ({products.length})
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Box sx={{ position: 'relative', width: '100%', pt: '100%' }}>
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    style={{
                      objectFit: 'contain',
                      padding: '20px',
                    }}
                  />
                </Link>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {product.price?.toLocaleString()} BYN
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                  >
                    В корзину
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromFavorites(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
