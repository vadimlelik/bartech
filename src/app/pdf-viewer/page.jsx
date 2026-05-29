'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ALLOWED_PDFS = new Set([
  '/videowathcing/videowatching.pdf',
  '/politic/politic.pdf',
]);

function PdfViewerContent() {
  const searchParams = useSearchParams();
  const src = searchParams.get('src');

  if (!src || !ALLOWED_PDFS.has(src)) {
    return (
      <p style={{ margin: 16, fontFamily: 'sans-serif' }}>PDF не найден</p>
    );
  }

  return (
    <embed
      src={src}
      type="application/pdf"
      style={{ display: 'block', width: '100%', height: '100vh', border: 0 }}
    />
  );
}

export default function PdfViewerPage() {
  return (
    <Suspense fallback={null}>
      <PdfViewerContent />
    </Suspense>
  );
}
