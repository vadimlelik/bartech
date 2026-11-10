'use client';

import Link from 'next/link';
import { Box, Button, Skeleton, Typography } from '@mui/material';

export function EmptyState({ title, text, actionHref, actionLabel }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #E1E5EB',
        borderRadius: '12px',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        textAlign: 'center',
      }}
    >
      <Typography component="h2" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1 }}>
        {title}
      </Typography>
      {text ? (
        <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: actionHref ? 2 : 0 }}>
          {text}
        </Typography>
      ) : null}
      {actionHref && actionLabel ? (
        <Button component={Link} href={actionHref} variant="contained">
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}

export function ErrorState({ title = 'Не удалось загрузить данные', text, onRetry }) {
  return (
    <Box
      role="alert"
      sx={{
        bgcolor: '#fff',
        border: '1px solid #E1E5EB',
        borderRadius: '12px',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 5 },
        textAlign: 'center',
      }}
    >
      <Typography component="h2" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1 }}>
        {title}
      </Typography>
      {text ? (
        <Typography color="text.secondary" sx={{ mb: onRetry ? 2 : 0 }}>
          {text}
        </Typography>
      ) : null}
      {onRetry ? (
        <Button variant="contained" onClick={onRetry}>
          Повторить
        </Button>
      ) : null}
    </Box>
  );
}

export function CardSkeletonGrid({ count = 8 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={320} sx={{ borderRadius: '12px' }} />
      ))}
    </Box>
  );
}
