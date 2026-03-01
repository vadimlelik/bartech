'use client';

import React, { useMemo } from 'react';
import styles from './pkPage.module.css';

const PK = () => {
  const pdfSrc = useMemo(() => 'videowathcing/videowatching.pdf', []);

  return (
    <div className={styles.container}>
      <h1>Правила видионадлюдения в помещении</h1>
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
        </div>

        <div className={styles.pdfFrame}>
          <object
            data={pdfSrc}
            type="application/pdf"
            className={styles.pdfObject}
          >
            <iframe
              src={pdfSrc}
              title="Правила видионадлюдения в помещении(PDF)"
              className={styles.pdfIframe}
            />
          </object>
        </div>
      </div>
    </div>
  );
};

export default PK;
