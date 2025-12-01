'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthInit({ children }) {
  useEffect(() => {
    // Инициализируем auth store при монтировании
    useAuthStore.getState().init();
    
    return () => {
      // Очищаем при размонтировании
      useAuthStore.getState().cleanup();
    };
  }, []); // Пустой массив зависимостей - выполняется только один раз

  return <>{children}</>;
}

