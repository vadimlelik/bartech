'use client';

import React from 'react';

import PdfPreview from '@/shared/ui/pdf-preview/PdfPreview';
import { ShopPage } from '@/shared/ui/shop-page/ShopPage';

import styles from './pkPage.module.css';

const PDF_PATH = '/videowathcing/videowatching.pdf';

const PK = () => {
  return (
    <ShopPage
      title="Правила видеонаблюдения в помещении"
      breadcrumbs={[
        { href: '/', label: 'Главная' },
        { label: 'Видеонаблюдение' },
      ]}
    >
      <PdfPreview
        pdfPath={PDF_PATH}
        title="Правила видеонаблюдения в помещении (PDF)"
        wrapClassName={styles.pdfWrap}
        toolbarClassName={styles.pdfToolbar}
        linkClassName={styles.pdfLink}
        frameClassName={styles.pdfFrame}
        iframeClassName={styles.pdfIframe}
      />
    </ShopPage>
  );
};

export default PK;
