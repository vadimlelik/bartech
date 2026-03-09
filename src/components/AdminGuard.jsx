'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

export default function AdminGuard({ children }) {
  const { user, profile, loading, init, fetchProfile } = useAuthStore();
  const accessGrantedRef = useRef(false);
  const profileRequestedRef = useRef(false);

  // Инициализируем auth store при монтировании
  useEffect(() => {
    init();
  }, [init]);

  // Ленивая загрузка профиля только на админской странице
  useEffect(() => {
    if (!loading && user && !profile && !profileRequestedRef.current) {
      profileRequestedRef.current = true;
      fetchProfile(user.id);
    }
  }, [loading, user, profile, fetchProfile]);

  // Если доступ уже был предоставлен, сохраняем это состояние
  useEffect(() => {
    if (!loading && user && profile && profile.role === 'admin') {
      accessGrantedRef.current = true;
    }
  }, [loading, user, profile]);

  // Если доступ уже был предоставлен, не скрываем содержимое при временных изменениях loading
  const shouldShowLoading =
    !accessGrantedRef.current && (loading || !user || !profile);

  if (shouldShowLoading) {
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

  if (!profile || profile.role !== 'admin') {
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

  return <>{children}</>;
}

