'use client';

import { Suspense } from 'react';
import { Box } from '@mui/material';
import ComparePanel from '@/components/ComparePanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <div>Загрузка...</div>
          </Box>
        }
      >
        {children}
      </Suspense>
      <ComparePanel />
      <Footer />
    </>
  );
}
