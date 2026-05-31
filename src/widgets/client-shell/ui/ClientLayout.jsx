'use client';

import { Suspense } from 'react';
import { LeadPopup } from '@/features/lead-popup';

export default function ClientLayout({ children }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <LeadPopup />
      </Suspense>
    </>
  );
}

