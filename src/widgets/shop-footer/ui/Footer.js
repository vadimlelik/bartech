'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, md: 5 },
        px: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: 4,
            border: '1px solid rgba(0, 123, 255, 0.15)',
            boxShadow: '0 14px 32px rgba(17, 24, 39, 0.12)',
            p: { xs: 2, md: 3 },
          }}
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                border: '1px solid rgba(148, 163, 184, 0.28)',
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 700 }}
              >
                Контактная информация
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                ООО «Баратех» УНП: 193796252
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                Регистрационный номер в Торговом реестре Республики Беларусь:
                732062
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                Юридический и почтовый адрес: 220013, г. Минск, ул. Сурганова, д.
                43
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.2 }}>
                <MuiLink
                  href="tel:+375447418423"
                  color="primary.main"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  +375 44 741-84-23
                </MuiLink>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Технобар. Свидетельство о гос. регистрации: выдано 07 октября
                2024 г. Минским горисполкомом. Регистрация в Торговом реестре:
                743083 от 26.02.2025.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                border: '1px solid rgba(148, 163, 184, 0.28)',
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.2,
                '& a': {
                  fontSize: { xs: '0.9rem', md: '0.98rem' },
                  color: 'text.secondary',
                  transition: 'color 0.2s ease',
                },
                '& a:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 700 }}
              >
                Информация
              </Typography>
              <Link href="/videowatching" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                Правила видионадлюдения в помещении
                </Typography>
              </Link>
              <Link href="/po" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  Публичная оферта
                </Typography>
              </Link>
              <Link href="/sales" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  Акции
                </Typography>
              </Link>
              <Link
                href="/guarantee"
                passHref
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="body2">
                  Возврат товара
                </Typography>
              </Link>
              <Link href="/installment" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  Купить в рассрочку
                </Typography>
              </Link>
              <Link href="/service" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  Сервисные центры
                </Typography>
              </Link>
              <Link href="/pk" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  Политика обработки персональных данных
                </Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                border: '1px solid rgba(148, 163, 184, 0.28)',
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, md: 2 },
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.9rem', md: '0.98rem' },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 700 }}
              >
                Дополнительно
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Работает на MixCMS
              </Typography>
              <Box sx={{ mt: { xs: 0.5, md: 1 } }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Варианты оплаты
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 2 },
                    mt: 1,
                    maxWidth: '180px',
                    '& > span': {
                      flex: '1 1 0',
                      display: 'flex !important',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: { xs: '12px', md: '16px' },
                      position: 'relative',
                    },
                    '& img': {
                      objectFit: 'contain',
                      imageRendering: '-webkit-optimize-contrast',
                      opacity: 0.9,
                    },
                  }}
                >
                  <Image
                    src="/images/payment-visa.png"
                    alt="Visa"
                    width={50}
                    height={100}
                    loading="lazy"
                  />
                  <Image
                    src="/images/payment-mastercard.png"
                    alt="Mastercard"
                    width={50}
                    height={100}
                    loading="lazy"
                  />
                  <Image
                    src="/images/payment-belcard.png"
                    alt="BelCard"
                    width={50}
                    height={100}
                    loading="lazy"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
