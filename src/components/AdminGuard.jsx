'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

export default function AdminGuard({ children }) {
  const { user, profile, loading } = useAuth();

  // Основная защита выполняется в middleware
  // Этот компонент только показывает состояние загрузки

  // Показываем загрузку пока проверяется авторизация
  if (loading || !user || !profile) {
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

  // Если роль не admin (middleware должен был перенаправить, но на всякий случай)
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

  // Если все проверки пройдены, показываем контент
  console.log('AdminGuard: Access granted', { userId: user?.id, role: profile.role });
  return <>{children}</>;
}

