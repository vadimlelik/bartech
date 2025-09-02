'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: { xs: 4, md: 6 },
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Юридическая информация */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Контактная информация
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              ООО «Баратех» УНП: 193796252
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Регистрационный номер в Торговом реестре Республики Беларусь:
              732062
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Юридический и почтовый адрес: 220068, г. Минск, ул. Червякова, д.
              60, пом. 179
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              <MuiLink href="tel:+375 44 741-84-23" color="inherit">
                +375 44 741-84-23
              </MuiLink>
            </Typography>
            <Typography variant="body2" color="text.info">
              Технобар Свидетельство о гос. регистрации: выдано 07 октября 2024
              г. Минским горисполкомом Регистрация в Торговом реестре: 743083 от
              26.02.2025
            </Typography>
          </Grid>

          {/* Ссылки */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Информация
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, md: 1.5 },
                '& a': {
                  fontSize: { xs: '0.875rem', md: '1rem' },
                },
              }}
            >
              <Link href="/privacy" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                  Политика конфиденциальности
                </Typography>
              </Link>
              <Link href="/po" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                  Публичная оферта
                </Typography>
              </Link>
              <Link
                href="/guarantee"
                passHref
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="body2" color="text.secondary">
                  Возврат товара
                </Typography>
              </Link>
              <Link href="/pass" passHref style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                  Условия рассрочки и сертификация
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary">
                +375 17 318-13-33; +375 17 360-82-11 – администрация Советского
                района г. Минска;
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +37517-218-00-82 – главное управление торговли и услуг
                Мингорисполкома.
              </Typography>
            </Box>
          </Grid>

          {/* Дополнительная информация */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, md: 2 },
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.875rem', md: '1rem' },
                },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Работает на MixCMS
              </Typography>
              <Box sx={{ mt: { xs: 1, md: 2 } }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Варианты оплаты
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 2 },
                    mt: 1,
                    maxWidth: '150px',
                    '& > span': {
                      flex: '1 1 0',
                      display: 'flex !important',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: { xs: '12px', md: '16px' },
                      position: 'relative',
                    },
                    '& img': {
                      // width: '100% !important',
                      // height: '100% !important',
                      objectFit: 'contain',
                      imageRendering: '-webkit-optimize-contrast',
                    },
                  }}
                >
                  <Image
                    src="/images/payment-visa.png"
                    alt="Visa"
                    width={50}
                    height={100}
                    priority
                    quality={100}
                    unoptimized
                  />
                  <Image
                    src="/images/payment-mastercard.png"
                    alt="Mastercard"
                    width={50}
                    height={100}
                    priority
                    quality={100}
                    unoptimized
                  />
                  <Image
                    src="/images/payment-belcard.png"
                    alt="BelCard"
                    width={50}
                    height={100}
                    priority
                    quality={100}
                    unoptimized
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Правовая информация */}
          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Интернет-сайт носит исключительно информационный характер и ни при
              каких условиях не является публичной офертой, определяемой
              положениями ст. 405 Гражданского кодекса Республики Беларусь.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
