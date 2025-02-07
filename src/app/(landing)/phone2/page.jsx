'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import styles from './phonePage.module.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { PIXEL, PIXEL_2 } from '@/data/pixel';
import toast from 'react-hot-toast';

import 'swiper/css';
import Quiz from '@/components/quiz/Quiz';
import Button from '@/app/(shop)/components/button/Button';

const images = [
  '/tel/tel1.jpg',
  '/tel/tel2.jpg',
  '/tel/tel3.jpg',
  '/tel/tel4.jpg',
  '/tel/tel5.jpg',
  '/tel/tel6.jpg',
  '/tel/tel7.jpg',
];
const questions = [
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

const Phone2 = () => {
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

  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.phone2);
      window.ttq.load(PIXEL_2.phone2);
      window.ttq.page();
    }
  }, []);

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
          router.push('/thank-you?source=phone2');
        });
    } catch (error) {
      toast.error('Ошибка при отправке заявки. Попробуйте еще раз.');
      throw error;
    }
  };

  const closeQuiz = () => {
    setIsQuizOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h5 className={styles.rating}>
            (4,9) ⭐️⭐️⭐️⭐️⭐️ 1031 отзыв Интернет-магазина
          </h5>
          <div className={styles.sliderContainer}>
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className={styles.slider}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.slideWrapper}>
                    <Image
                      src={src}
                      alt={`Slide ${index + 1}`}
                      width={400}
                      height={300}
                      objectFit="cover"
                      className={styles.image}
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <h1 className={styles.title}>
            ТЕЛЕФОНЫ В РАССРОЧКУ СО СКИДКОЙ ДО 50%
          </h1>
          <ul className={styles.info}>
            <li className={styles.infoItem}>
              ✅ Одобряем всем без справок о доходах
            </li>
            <li className={styles.infoItem}>✅ 0 рублей первый взнос</li>
            <li className={styles.infoItem}>✅ Всего от 29 руб/мес</li>
            <li className={styles.infoItem}>
              ✅ Бесплатная доставка в подарок
            </li>
          </ul>
          <div className={styles.bye}>
            <strong className={styles.byeText}>
              Жмите кнопку ниже,
              <br /> чтобы подобрать модель и узнать цену
            </strong>
            <p>⬇️⬇️⬇️⬇️⬇️</p>
            <Button
              className={styles.button}
              label="Подобрать телефон"
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
        title="Phone2"
      />
    </div>
  );
};

export default Phone2;
