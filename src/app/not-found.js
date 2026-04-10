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

export default function NotFound() {
  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Извините, запрашиваемая страница не существует.
        </Typography>
        <Button component={Link} href="/" variant="contained" color="primary">
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
}
