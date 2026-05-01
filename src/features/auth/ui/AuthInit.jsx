'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';

export default function AuthInit({ children }) {
  useEffect(() => {
    // Откладываем инициализацию auth, чтобы не конкурировать с first paint.
    const runInit = () => {
      useAuthStore.getState().init();
    };

    const scheduleIdle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback(runInit, { timeout: 1500 })
        : setTimeout(runInit, 250);
    
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(scheduleIdle);
      } else {
        clearTimeout(scheduleIdle);
      }

      // Очищаем при размонтировании
      useAuthStore.getState().cleanup();
    };
  }, []); // Пустой массив зависимостей - выполняется только один раз

  return <>{children}</>;
}

