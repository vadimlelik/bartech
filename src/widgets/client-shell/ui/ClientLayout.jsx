'use client';

import { Suspense } from 'react';
import { LeadPopup } from '@/features/lead-popup';
import RouteProgress from '@/widgets/route-progress/ui/RouteProgress';

export default function ClientLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <LeadPopup />
      </Suspense>
    </>
  );
}

