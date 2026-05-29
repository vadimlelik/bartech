'use client';

import React, { useMemo } from 'react';

export default function PdfPreview({
  pdfPath,
  title,
  wrapClassName,
  toolbarClassName,
  linkClassName,
  frameClassName,
  iframeClassName,
}) {
  const viewerSrc = useMemo(
    () => `/pdf-viewer?src=${encodeURIComponent(pdfPath)}`,
    [pdfPath],
  );

  return (
    <div className={wrapClassName}>
      <div className={toolbarClassName}>
        <a className={linkClassName} href={pdfPath} target="_blank" rel="noreferrer">
          Открыть PDF в новой вкладке
        </a>
      </div>
      <div className={frameClassName}>
        <iframe src={viewerSrc} title={title} className={iframeClassName} />
      </div>
    </div>
  );
}
