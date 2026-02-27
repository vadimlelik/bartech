'use client';

import React, { useMemo } from 'react';
import styles from './pkPage.module.css';

const PK = () => {
  const pdfSrc = useMemo(() => 'politic/politic.pdf', []);

  return (
    <div className={styles.container}>
      <h1>Политика обработки персональных данных </h1>
      <div className={styles.pdfWrap}>
        <div className={styles.pdfToolbar}>
          <a
            className={styles.pdfLink}
            href={pdfSrc}
            target="_blank"
            rel="noreferrer"
          >
            Открыть PDF в новой вкладке
          </a>
          <a className={styles.pdfLink} href={pdfSrc} download>
            Скачать
          </a>
        </div>

        <div className={styles.pdfFrame}>
          <object
            data={pdfSrc}
            type="application/pdf"
            className={styles.pdfObject}
          >
            <iframe
              src={pdfSrc}
              title="Политика обработки персональных данных (PDF)"
              className={styles.pdfIframe}
            />
          </object>
        </div>
      </div>
    </div>
  );
};

export default PK;
