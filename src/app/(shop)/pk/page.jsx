'use client';



import React from 'react';

import PdfPreview from '@/shared/ui/pdf-preview/PdfPreview';
import InfoNav from '@/shared/ui/info-nav/InfoNav';

import styles from './pkPage.module.css';



const PDF_PATH = '/politic/politic.pdf';



const PK = () => {

  return (

    <div className={styles.container}>
      <InfoNav />

      <h1>Политика обработки персональных данных </h1>

      <PdfPreview

        pdfPath={PDF_PATH}

        title="Политика обработки персональных данных (PDF)"

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

