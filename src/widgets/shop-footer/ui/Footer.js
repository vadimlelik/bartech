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
import { useCity } from '@/entities/city';
import { categoryPublicPath } from '@/shared/lib/category-path';
import { cityAddressLine, cityCall, cityWorkHours } from '@/entities/city/lib/city-content';
import { useServiceCity } from '@/entities/locality/ui/useServiceCity';

const LINK_SX = {
  color: '#C5CCD6',
  fontSize: '0.95rem',
  '&:hover': { color: '#FFFFFF' },
};

export default function Footer({ categories = [] }) {
  const { commerceCity, pageCity, cities, href } = useCity();
  const city = commerceCity || pageCity;
  const serviceCity = useServiceCity();
  const phone = cityCall(serviceCity);
  const address = cityAddressLine(serviceCity);
  const hours = cityWorkHours(serviceCity);
  const area = city?.nameDative || 'Минску';

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#2B3440',
        color: '#C5CCD6',
        pt: { xs: 5, md: 7 },
        pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              О магазине
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
              Texnobar — техника в рассрочку с доставкой по {area} и Беларуси.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
              ООО «Баратех» УНП: 193796252. Регистрационный номер в Торговом
              реестре Республики Беларусь: 732062.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Технобар. Свидетельство о гос. регистрации: выдано 07 октября 2024
              г. Минским горисполкомом. Регистрация в Торговом реестре: 743083
              от 26.02.2025.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1, mt: 1.5 }}>
              <Link href={href('/contacts')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Реквизиты и контакты</Typography>
              </Link>
              <Link href={href('/reviews')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Отзывы покупателей</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              Покупателям
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
              <Link href={href('/payment_delivery')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Оплата и доставка</Typography>
              </Link>
              <Link href={href('/installment')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Купить в рассрочку</Typography>
              </Link>
              <Link href={href('/sales')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Акции</Typography>
              </Link>
              <Link href={href('/guarantee')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Возврат товара</Typography>
              </Link>
              <Link href={href('/reviews')} style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Отзывы</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              Компания
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
              <Link href="/po" style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Публичная оферта</Typography>
              </Link>
              <Link href="/pk" style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Политика обработки персональных данных</Typography>
              </Link>
              <Link href="/videowatching" style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Правила видеонаблюдения в помещении</Typography>
              </Link>
              <Link href="/service" style={{ textDecoration: 'none' }}>
                <Typography sx={LINK_SX}>Сервисные центры</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              Контакты
            </Typography>
            {address ? (
              <Typography variant="body2" sx={{ mb: 1.2, lineHeight: 1.6 }}>
                {address}
              </Typography>
            ) : null}
            {phone ? (
              <MuiLink href={`tel:${phone.tel}`} underline="hover" sx={{ ...LINK_SX, fontWeight: 700 }}>
                {phone.display}
              </MuiLink>
            ) : null}
            {hours ? (
              <Typography variant="body2" sx={{ mt: 1.2, mb: 2 }}>
                {hours}
              </Typography>
            ) : null}
            <Typography variant="body2" sx={{ mb: 1 }}>
              Варианты оплаты
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Image src="/images/payment-visa.png" alt="Visa" width={42} height={28} style={{ objectFit: 'contain' }} />
              <Image src="/images/payment-mastercard.png" alt="Mastercard" width={42} height={28} style={{ objectFit: 'contain' }} />
              <Image src="/images/payment-belcard.png" alt="BelCard" width={42} height={28} style={{ objectFit: 'contain' }} />
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
              Работает на MixCMS
            </Typography>
          </Grid>
        </Grid>
        {cities.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              Города
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {cities.map((item) => (
                <Link key={item.slug} href={item.slug === 'minsk' ? '/' : `/${item.slug}`} style={{ textDecoration: 'none' }}>
                  <Typography sx={LINK_SX}>{item.name}</Typography>
                </Link>
              ))}
            </Box>
          </Box>
        ) : null}
        {categories.length > 0 ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" component="h2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
              Категории {city?.nameIn ? `в ${city.nameIn}` : ''}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {categories.map((category) => (
                <Link key={category.id} href={href(categoryPublicPath(category.id))} style={{ textDecoration: 'none' }}>
                  <Typography sx={LINK_SX}>{category.name}</Typography>
                </Link>
              ))}
            </Box>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
