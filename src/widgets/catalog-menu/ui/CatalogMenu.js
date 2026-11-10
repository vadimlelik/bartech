'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PercentIcon from '@mui/icons-material/Percent';

function RowIcon({ image, alt, accent }) {
  const [failed, setFailed] = useState(false);

  if (accent === 'sale') {
    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#e53935',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <PercentIcon fontSize="small" />
      </Box>
    );
  }

  if (image && !failed) {
    return (
      <Box
        component="img"
        src={image}
        alt={alt}
        onError={() => setFailed(true)}
        sx={{
          width: 44,
          height: 44,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />
    );
  }

  return <Box sx={{ width: 44, height: 44, flexShrink: 0 }} />;
}

export default function CatalogMenu({ items }) {
  return (
    <Box
      component="nav"
      aria-label="Разделы каталога"
      sx={{
        maxWidth: 520,
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden',
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.href}
          component={Link}
          href={item.href}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            color: 'text.primary',
            textDecoration: 'none',
            borderTop: index === 0 ? 'none' : '1px solid',
            borderColor: 'rgba(15, 23, 42, 0.06)',
            '&:hover': { bgcolor: '#f7f9fc' },
          }}
        >
          <RowIcon image={item.image} alt="" accent={item.accent} />
          <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.3 }}>
            {item.name}
          </Typography>
          <ChevronRightIcon sx={{ color: 'text.disabled' }} />
        </Box>
      ))}
    </Box>
  );
}
