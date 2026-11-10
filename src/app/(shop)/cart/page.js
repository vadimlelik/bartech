'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/entities/cart';
import { useCity } from '@/entities/city';
import { minOrderShortfall, orderGoodsTotal } from '@/entities/city/lib/delivery-rules';
import { useLocality } from '@/entities/locality/ui/LocalityProvider';
import { resolveServiceCity } from '@/entities/locality/lib/service-city';
import { showCityField } from '@/entities/city/lib/city-content';
import { shopSurfaceSx, shopTitleSx } from '@/shared/ui/shop-page/ShopPage';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, cityNotices, applyCityCatalog } =
    useCartStore();
  const { commerceCity, cities, href } = useCity();
  const { locality } = useLocality();
  const deliveryCity = resolveServiceCity(locality, cities, commerceCity);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    if (!commerceCity?.slug || cartItems.length === 0) return;
    const ids = cartItems.map((item) => item.id).join(',');
    let cancelled = false;
    // TODO: цены в корзине пока берутся из города страницы, не из населённого пункта.
    fetch(`/api/products?ids=${ids}&limit=100`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) applyCityCatalog(commerceCity.slug, data.products || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [commerceCity?.slug, applyCityCatalog, cartItems.length]);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  }, [updateQuantity]);

  // Мемоизируем итоговую сумму корзины
  const cartTotal = useMemo(() => getCartTotal(), [ getCartTotal]);

  if (!cartItems.length) {
    return (
      <>
        <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Box>
              <Typography component="h1" sx={shopTitleSx}>
                Корзина пуста
              </Typography>
              <Button
                component={Link}
                href={href('/catalog')}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Вернуться к покупкам
              </Button>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          <Typography component="h1" sx={shopTitleSx}>
            Корзина
          </Typography>
          {cityNotices.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {cityNotices.map((notice) => notice.message).join(' ')} Позиции не удалены.
            </Alert>
          )}
          {showCityField(deliveryCity, 'minOrder') && deliveryCity?.minOrderAmount ? (
            <Alert severity={minOrderShortfall(deliveryCity, orderGoodsTotal(cartItems)) > 0 ? 'warning' : 'info'} sx={{ mb: 2 }}>
              Минимальная сумма заказа в {deliveryCity.nameIn || deliveryCity.name}: {deliveryCity.minOrderAmount} BYN.
            </Alert>
          ) : null}

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper} sx={{ ...shopSurfaceSx, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="center">Количество</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => {
                      const itemTotal = item.price * item.quantity;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 80,
                                  height: 80,
                                  mr: 2,
                                }}
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                  sizes="80px"
                                  loading="lazy"
                                />
                              </Box>
                              <div
                                // href={`/products/${item.id}`}
                                style={{
                                  textDecoration: 'none',
                                  color: 'inherit',
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {item.name}
                                </Typography>
                              </div>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1">
                              {item.price.toFixed(2)} BYN
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography sx={{ mx: 2 }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1">
                              {itemTotal.toFixed(2)} BYN
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removeFromCart(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                  startIcon={<DeleteIcon />}
                >
                  Очистить корзину
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Итого
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography>Товары ({cartItems.length}):</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">
                        {cartTotal.toFixed(2)} BYN
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography>Доставка:</Typography>
                    <Typography>Бесплатно</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">К оплате:</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">
                        {cartTotal.toFixed(2)} BYN
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => router.push('/checkout')}
                  >
                    Оформить заказ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
