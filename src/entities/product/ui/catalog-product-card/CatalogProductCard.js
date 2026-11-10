'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Card, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCity } from '@/entities/city';
import { productPublicPath } from '@/shared/lib/product-path';
import { useFavoritesStore } from '@/entities/favorites';
import InstallmentRequestDialog from '@/entities/product/ui/installment-request-dialog/InstallmentRequestDialog';
import {
  formatByn,
  getFullPrice,
  getMonthlyPayment,
} from '@/entities/product/lib/pricing';

export default function CatalogProductCard({ product, onFavoriteToggle }) {
  const { href } = useCity();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addToFavorites = useFavoritesStore((state) => state.addToFavorites);
  const removeFromFavorites = useFavoritesStore((state) => state.removeFromFavorites);
  const [mounted, setMounted] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || '/logo_techno_bar.svg');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fullPrice = getFullPrice(product);
  const monthly = getMonthlyPayment(product);
  const onOrder = (product.availabilityStatus || product.availability_status || 'in_stock') === 'on_order';
  const isFavorite = mounted && favorites.includes(String(product.id));
  const discount = Number(product.discount) > 0 ? Number(product.discount) : 0;

  const toggleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite) removeFromFavorites(product.id);
    else addToFavorites(product.id);
    onFavoriteToggle?.(product, !isFavorite);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid #E1E5EB',
        boxShadow: 'none',
        overflow: 'hidden',
        bgcolor: '#fff',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(31, 41, 51, 0.08)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component={Link}
          href={href(productPublicPath(product))}
          aria-label={product.name || 'Товар'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box sx={{ position: 'relative', height: 180, bgcolor: '#F3F5F8', m: 1.5, borderRadius: '8px' }}>
            <Image
              src={imageSrc}
              alt={product.name || 'Товар'}
              fill
              sizes="(max-width: 600px) 50vw, 25vw"
              style={{ objectFit: 'contain', padding: 12 }}
              onError={() => setImageSrc('/logo_techno_bar.svg')}
            />
          </Box>
        </Box>
        <IconButton
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: '#fff',
            border: '1px solid #E1E5EB',
            width: 36,
            height: 36,
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#D93C3C', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {discount > 0 && (
            <Box sx={{ bgcolor: '#D93C3C', color: '#fff', borderRadius: '18px', px: 1, py: 0.25, fontSize: 12, fontWeight: 500 }}>
              −{discount}%
            </Box>
          )}
          {product.isNew && (
            <Box sx={{ bgcolor: '#E8F0FE', color: '#1D6FE8', borderRadius: '18px', px: 1, py: 0.25, fontSize: 12, fontWeight: 500 }}>
              Новинка
            </Box>
          )}
          <Box
            sx={{
              bgcolor: onOrder ? '#F8F1E3' : '#E7F6EE',
              color: onOrder ? '#B7791F' : '#1E8E4E',
              borderRadius: '18px',
              px: 1,
              py: 0.25,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {onOrder ? 'Под заказ' : 'В наличии'}
          </Box>
        </Box>
      </Box>

      <Box
        component={Link}
        href={href(productPublicPath(product))}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
          flexGrow: 1,
          px: 2,
          pb: 1,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontWeight: 500,
            fontSize: 15,
            lineHeight: 1.4,
            mb: 1,
            minHeight: 42,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>
        {fullPrice > 0 && (
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1F2933' }}>
            {formatByn(fullPrice)}
          </Typography>
        )}
        {monthly > 0 && (
          <Typography
            sx={{
              mt: 0.75,
              alignSelf: 'flex-start',
              bgcolor: '#E8F0FE',
              color: '#1D6FE8',
              borderRadius: '8px',
              px: 1,
              py: 0.5,
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            от {formatByn(monthly)} в месяц
          </Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setRequestOpen(true)}
          sx={{ minHeight: 44, lineHeight: 1.2, fontSize: 14 }}
        >
          Оформить в рассрочку
        </Button>
      </Box>
      <InstallmentRequestDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        product={product}
      />
    </Card>
  );
}
