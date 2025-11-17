'use client';

import { Suspense } from 'react';

export default function Template({ children }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <div>Загрузка...</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

