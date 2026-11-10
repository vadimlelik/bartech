'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const DISMISS_KEY = 'city-suggest-dismissed';

export default function CitySuggest({ currentSlug, cities, onConfirm, onChooseOther }) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return undefined;
    const controller = new AbortController();
    fetch('/api/cities/suggest', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        const slug = data?.slug;
        if (!slug || slug === currentSlug) return;
        const match = cities.find((city) => city.slug === slug);
        if (match) setSuggestion(match);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [cities, currentSlug]);

  if (!suggestion) return null;

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, '1');
    setSuggestion(null);
  };

  return (
    <Box
      role="dialog"
      aria-labelledby="city-suggest-title"
      sx={{
        position: 'fixed',
        top: 'calc(var(--header-offset, 64px) + 8px)',
        left: 16,
        zIndex: 1200,
        width: 'min(320px, calc(100vw - 32px))',
        bgcolor: '#fff',
        border: '1px solid #E1E5EB',
        borderRadius: '8px',
        p: 1.5,
        boxShadow: '0 8px 24px rgba(31, 41, 51, 0.12)',
      }}
    >
      <Typography id="city-suggest-title" sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
        Ваш город {suggestion.name}?
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            dismiss();
            onConfirm(suggestion.slug);
          }}
        >
          Да
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={() => {
            dismiss();
            onChooseOther();
          }}
        >
          Выбрать другой
        </Button>
      </Box>
    </Box>
  );
}
