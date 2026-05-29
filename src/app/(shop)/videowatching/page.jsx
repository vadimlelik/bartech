'use client';

import React from 'react';
import PdfPreview from '@/shared/ui/pdf-preview/PdfPreview';
import styles from './pkPage.module.css';

const PDF_PATH = '/videowathcing/videowatching.pdf';

const PK = () => {
  return (
    <div className={styles.container}>
      <h1>Правила видионадлюдения в помещении</h1>
      <PdfPreview
        pdfPath={PDF_PATH}
        title="Правила видионадлюдения в помещении (PDF)"
        wrapClassName={styles.pdfWrap}
        toolbarClassName={styles.pdfToolbar}
        linkClassName={styles.pdfLink}
        frameClassName={styles.pdfFrame}
        iframeClassName={styles.pdfIframe}
      />
    </div>
  );
};

export default PK;
