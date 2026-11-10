import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Страница не найдена | Texnobar',
  description:
    'Запрошенная страница не найдена. Перейдите в каталог Texnobar: телефоны, ноутбуки, телевизоры и техника в рассрочку в Минске.',
  alternates: {
    canonical: siteUrl,
  },
};

const LINKS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/installment', label: 'Рассрочка' },
  { href: '/payment_delivery', label: 'Оплата и доставка' },
  { href: '/contacts', label: 'Контакты' },
];

export default function NotFound() {
  return (
    <Container>
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Typography component="p" sx={{ color: '#6B7683', fontWeight: 500, mb: 1 }}>
          404
        </Typography>
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' }, mb: 1 }}>
          Страница не найдена
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 460 }}>
          Такой страницы нет. Найдите товар через поиск или откройте один из разделов.
        </Typography>
        <Box
          component="form"
          action="/search"
          method="get"
          sx={{ display: 'flex', gap: 1, width: 'min(100%, 420px)', mb: 3 }}
        >
          <Box
            component="input"
            name="q"
            aria-label="Поиск по каталогу"
            placeholder="Поиск по каталогу"
            sx={{
              flex: 1,
              height: 44,
              borderRadius: '8px',
              border: '1px solid #CBD2DC',
              px: 1.5,
              font: 'inherit',
            }}
          />
          <Button type="submit" variant="contained">
            Найти
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {LINKS.map((item) => (
            <Button key={item.href} component={Link} href={item.href} variant="outlined">
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
