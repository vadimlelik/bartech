'use client';

import Footer from '@/widgets/landing-footer/ui/Footer';
import { Box } from '@mui/material';

export default function LandingClientLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {children}
      <Footer />
    </Box>
  );
}
