'use client';

import { Suspense } from 'react';
import { Box } from '@mui/material';

export default function Template({ children }) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <div>Загрузка...</div>
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}

