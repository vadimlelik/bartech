'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Error({ reset }) {
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
          py: 4,
        }}
      >
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' }, mb: 1 }}>
          Страница не открылась
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 460 }}>
          Попробуйте обновить её. Если ошибка повторится, вернитесь в каталог.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => reset()}>
            Обновить
          </Button>
          <Button component={Link} href="/catalog" variant="outlined">
            В каталог
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
