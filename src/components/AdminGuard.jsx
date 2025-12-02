'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

export default function AdminGuard({ children }) {
  const { user, profile, loading, init } = useAuthStore();
  const accessGrantedRef = useRef(false);

  // Убеждаемся, что auth store инициализирован
  useEffect(() => {
    init();
  }, [init]);

  // Если доступ уже был предоставлен, сохраняем это состояние
  useEffect(() => {
    if (!loading && user && profile && profile.role === 'admin') {
      accessGrantedRef.current = true;
    }
  }, [loading, user, profile]);

  // Если доступ уже был предоставлен, не скрываем содержимое при временных изменениях loading
  const shouldShowLoading = (!accessGrantedRef.current && (loading || !user || !profile));

  if (shouldShowLoading) {
    console.log('AdminGuard: Waiting for auth...', { loading, hasUser: !!user, hasProfile: !!profile, profileRole: profile?.role });
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Загрузка...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (profile.role !== 'admin') {
    console.log('AdminGuard: User is not admin', { role: profile.role });
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Доступ запрещен
          </Typography>
          <Typography variant="body1" color="text.secondary">
            У вас нет прав администратора
          </Typography>
        </Box>
      </Container>
    );
  }

  console.log('AdminGuard: Access granted', { userId: user?.id, role: profile.role });
  return <>{children}</>;
}

