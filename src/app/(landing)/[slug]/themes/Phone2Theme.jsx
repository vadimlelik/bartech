'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import styles from './Phone2Theme.module.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import 'swiper/css';
import Quiz from '@/components/quiz/Quiz';
import Button from '@/app/(shop)/components/button/Button';

const defaultQuestions = [
  {
    id: 1,
    question: 'Выберите бренд телефона',
    type: 'checkbox',
    options: [
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Apple', label: 'Apple' },
      { value: 'Huawei', label: 'Huawei' },
      { value: 'Redmi', label: 'Redmi' },
      { value: 'Phone armor', label: 'Броне телефон' },
    ],
  },
  {
    id: 3,
    question: 'На какой ежемесячный платеж Вы рассчитываете?',
    type: 'radio',
    options: [
      { value: 'от 30 до 50 BYN/мес', label: 'от 30 до 50 BYN/мес' },
      { value: 'от 50 до 100 BYN/мес', label: 'от 50 до 100 BYN/мес' },
      { value: 'от 100 до 200 BYN/мес', label: 'от 100 до 200 BYN/мес' },
      { value: 'от 200 BYN/мес', label: 'от 200 BYN/мес' },
    ],
  },
  {
    id: 4,
    question: 'Введите ваш номер телефона',
    type: 'text',
  },
];

export default function Phone2Theme({ landingPage }) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  const content = landingPage?.content || {};
  const images = landingPage?.images || [];
  const pixels = landingPage?.pixels || [];

  useEffect(() => {
    if (window.ttq && pixels && pixels.length > 0) {
      // Фильтруем и загружаем только валидные пиксели (непустые строки)
      const validPixels = pixels.filter(p => p && typeof p === 'string' && p.trim() !== '');
      validPixels.forEach((pixel) => {
        const pixelId = pixel.trim();
        if (pixelId) {
          window.ttq.load(pixelId);
        }
      });
      if (validPixels.length > 0) {
        window.ttq.page();
      }
    }
  }, [pixels]);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios
        .post(
          'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
          {
            FIELDS: {
              ...data.FIELDS,
              UTM_SOURCE: utm_source || '',
              UTM_MEDIUM: utm_medium || '',
              UTM_CAMPAIGN: utm_campaign || '',
              UTM_CONTENT: utm_content || '',
              UTM_TERM: ad + ttclid || '',
            },
          }
        )
        .then(() => {
          setIsQuizOpen(false);
          router.push(`/thank-you?source=${landingPage?.slug || 'landing'}`);
        });
    } catch (error) {
      toast.error('Ошибка при отправке заявки. Попробуйте еще раз.');
      throw error;
    }
  };

  const closeQuiz = () => {
    setIsQuizOpen(false);
  };

  const questions = content.questions || defaultQuestions;
  const infoItems = Array.isArray(content.infoItems) 
    ? content.infoItems 
    : (content.infoItems ? [content.infoItems] : []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {content.rating && (
            <h5 className={styles.rating}>{content.rating}</h5>
          )}
          {images.length > 0 && (
            <div className={styles.sliderContainer}>
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                spaceBetween={0}
                navigation
                pagination={{ clickable: true }}
                className={styles.slider}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                  480: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                  768: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                  1024: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                }}
              >
                {images.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.slideWrapper}>
                      <Image
                        src={src}
                        alt={`Slide ${index + 1}`}
                        width={1200}
                        height={675}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        className={styles.image}
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {content.title && (
            <h1 className={styles.title}>{content.title}</h1>
          )}
          {infoItems.length > 0 && (
            <ul className={styles.info}>
              {infoItems.map((item, index) => (
                <li key={index} className={styles.infoItem}>
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.bye}>
            {content.byeText && (
              <strong className={styles.byeText}>{content.byeText}</strong>
            )}
            <p>⬇️⬇️⬇️⬇️⬇️</p>
            <Button
              className={styles.button}
              label={content.buttonText || 'Подобрать телефон'}
              onClick={() => setIsQuizOpen(true)}
            />
          </div>
        </div>
      </div>

      <Quiz
        isOpen={isQuizOpen}
        onClose={closeQuiz}
        questions={questions}
        isLoading={isLoading}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title={landingPage?.title || 'Phone2'}
      />
    </div>
  );
}
