'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ThankYou.module.css';
import { useSearchParams } from 'next/navigation';
import {
  PIXEL,
  PIXEL_2,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
} from '@/data/pixel';

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  useEffect(() => {
    if (source) {
      const pixelId = PIXEL[source];
      const pixelId_2 = PIXEL_2[source];
      const pixelId_3 = PIXEL_3[source];
      const pixelId_4 = PIXEL_4[source];
      const pixelId_5 = PIXEL_5[source];
      const pixelId_6 = PIXEL_6[source];

      if (window.ttq) {
        window.ttq.load(pixelId);
        window.ttq.load(pixelId_2);
        window.ttq.load(pixelId_3);
        window.ttq.load(pixelId_4);
        window.ttq.load(pixelId_5);
        window.ttq.load(pixelId_6);

        window.ttq.page();
      }
    }
  }, [source]);

  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Спасибо за отправку формы!
      </motion.h1>

      {/* Подзаголовок с анимацией */}
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Мы получили ваши данные и скоро свяжемся с вами.
      </motion.p>

      {/* Анимация благодарности */}
      <motion.div
        className={styles.animationContainer}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className={styles.heart}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ❤️
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
