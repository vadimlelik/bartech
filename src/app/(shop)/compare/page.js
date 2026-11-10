'use client';

import Link from 'next/link';
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import Image from 'next/image';
import { useCompareStore } from '@/entities/compare';
import CloseIcon from '@mui/icons-material/Close';
import { shopSurfaceSx, shopTitleSx } from '@/shared/ui/shop-page/ShopPage';

const stickyCellSx = {
  position: 'sticky',
  left: 0,
  zIndex: 1,
  bgcolor: '#fff',
  minWidth: 140,
  boxShadow: '1px 0 0 #E1E5EB',
};

export default function ComparePage() {
  const { compareItems, removeFromCompare } = useCompareStore();

  if (compareItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography component="h1" sx={shopTitleSx}>
          Сравнение товаров
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Нет товаров для сравнения. Добавьте товары со страницы каталога, чтобы сравнить их характеристики.
        </Typography>
        <Button component={Link} href="/catalog" variant="contained">
          Перейти в каталог
        </Button>
      </Container>
    );
  }

  const allSpecs = compareItems.reduce((specs, item) => {
    if (item.specifications &&
        typeof item.specifications === 'object' &&
        !Array.isArray(item.specifications)) {
      Object.keys(item.specifications).forEach((spec) => {
        const value = item.specifications[spec];
        if (value && value !== '' && value !== null && value !== undefined && String(value).trim() !== '' && !specs.includes(spec)) {
          specs.push(spec);
        }
      });
    }
    return specs;
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography component="h1" sx={shopTitleSx}>
          Сравнение товаров
        </Typography>

        <TableContainer component={Paper} sx={{ ...shopSurfaceSx, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={stickyCellSx}>Характеристики</TableCell>
                {compareItems.map((item) => {
                  const isProductInStock =
                    (item.availabilityStatus || item.availability_status || 'in_stock') !== 'on_order';
                  const totalPrice = item.totalPrice ?? item.total_price;
                  const numericPrice = Number(item.price) || 0;
                  const numericTotalPrice = Number(totalPrice) > 0 ? Number(totalPrice) : numericPrice * 3.35;
                  const displayPrice = isProductInStock
                    ? numericTotalPrice > 0
                      ? `${Math.round(numericTotalPrice).toLocaleString('ru-RU')} BYN${
                          numericPrice > 0 ? ` · от ${numericPrice.toFixed(2)} BYN/мес.` : ''
                        }`
                      : ''
                    : numericPrice > 0
                      ? `от ${numericPrice.toFixed(2)} BYN/мес.`
                      : '';

                  return (
                    <TableCell key={item.id} align="center" sx={{ minWidth: 180 }}>
                      <Box sx={{ position: 'relative' }}>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCompare(item.id)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 1,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            pt: 4,
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={150}
                            height={150}
                            style={{
                              objectFit: 'contain',
                            }}
                          />
                          <Typography variant="subtitle1">{item.name}</Typography>
                          {displayPrice && (
                            <Typography variant="h6" color="primary">
                              {displayPrice}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {allSpecs.map((spec) => {
                const hasAnyValue = compareItems.some((item) => {
                  const value = item.specifications?.[spec];
                  return value && value !== '' && value !== null && value !== undefined;
                });

                if (!hasAnyValue) return null;

                return (
                  <TableRow key={spec}>
                    <TableCell component="th" scope="row" sx={stickyCellSx}>
                      {spec}
                    </TableCell>
                    {compareItems.map((item) => {
                      const value = item.specifications?.[spec];
                      const displayValue = (value && value !== '' && value !== null && value !== undefined)
                        ? value
                        : '-';
                      return (
                        <TableCell key={item.id} align="center">
                          {displayValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
