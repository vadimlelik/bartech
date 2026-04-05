'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/shared/config/theme';
import { Box } from '@mui/material';
import AuthInit from '@/features/auth/ui/AuthInit';

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthInit>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </AuthInit>
    </ThemeProvider>
  );
}

