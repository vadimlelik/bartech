'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ThankYou.module.css';
import { useSearchParams } from 'next/navigation';
import {
  PIXEL,
  PIXEL_10,
  PIXEL_11,
  PIXEL_12,
  PIXEL_13,
  PIXEL_14,
  PIXEL_15,
  PIXEL_16,
  PIXEL_2,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
  PIXEL_7,
  PIXEL_8,
  PIXEL_9,
} from '@/data/pixel';
import { loadTikTokPixels } from '@/shared/utils';

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  useEffect(() => {
    if (!source) return;

    // Сначала проверяем статические пиксели (для старых лендингов)
    const staticPixelIds = [
      PIXEL[source],
      PIXEL_2[source],
      PIXEL_3[source],
      PIXEL_4[source],
      PIXEL_5[source],
      PIXEL_6[source],
      PIXEL_7[source],
      PIXEL_8[source],
      PIXEL_9[source],
      PIXEL_10[source],
      PIXEL_11[source],
      PIXEL_12[source],
      PIXEL_13[source],
      PIXEL_14[source],
      PIXEL_15[source],
      PIXEL_16[source],
    ].filter(Boolean); // Фильтруем undefined значения

    // Если есть статические пиксели, используем их
    if (staticPixelIds.length > 0) {
      loadTikTokPixels(staticPixelIds);
    } else {
      // Если статических пикселей нет, пытаемся получить из базы данных (динамические лендинги)
      fetch(`/api/landings/${source}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Landing not found');
          }
          return res.json();
        })
        .then((data) => {
          if (
            data.landing &&
            Array.isArray(data.landing.pixels) &&
            data.landing.pixels.length > 0
          ) {
            loadTikTokPixels(data.landing.pixels);
          }
        })
        .catch((error) => {
          console.error('Error fetching landing pixels:', error);
        });
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
