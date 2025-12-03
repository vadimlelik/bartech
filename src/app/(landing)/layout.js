'use client';

import Footer from '@/shared/ui/footer/Footer';
import { Box } from '@mui/material';

export default function LandingLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white',
      }}
    >
      {children}
      <Footer />
    </Box>
  );
}
