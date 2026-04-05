'use client';

import Loading from '@/app/loading';
import {
  PIXEL,
  PIXEL_2,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
  PIXEL_7,
  PIXEL_8,
} from '@/shared/config/pixel';
import { loadTikTokPixels } from '@/shared/utils';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/shared/ui/countdown-timer/CountdownTimer';
import Quiz from '@/features/quiz/ui/Quiz';

const advantages = [
  {
    id: 1,
    title: 'Выгодная рассрочка',
    description:
      'Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах. Без аванса и поручителей. С возможностью досрочного погашения',
  },
  {
    id: 2,
    title: 'Оптовые цены',
    description:
      'Мы сотрудничаем с заводами-производителями, поэтому наши цены приятные по всему рынку Беларуси!',
  },
  {
    id: 3,
    title: 'Доставка',
    description: 'Бесплатная доставка в любую точку Беларуси',
  },
];

const reviews = [
  {
    id: 1,
    author: 'Игорь, Минск 30 лет',
    text: 'Купил электровелосипед, и теперь не устаю от поездок на работу! Включаю мотор, и он помогает мне легко подниматься в гору и ехать быстрее. Теперь добираюсь до работы за половину времени!',
    image: '/images/bicycles/review_bicycles1.jpg',
  },
  {
    id: 2,
    author: 'Ольга, Минск',
    text: 'Очень довольна своим электровелосипедом! Езжу на нем в парк, в магазин, просто катаюсь по городу. Очень комфортно и весело! Батарея долго держит заряд, так что можно проехать далеко! Пользуюсь уже год, никаких проблем не возникло. Спасибо за оперативность и низкие цены!',
    image: '/images/bicycles/review_bicycles2.jpg',
  },
  {
    id: 3,
    author: 'Максим, Мозырь',
    text: 'Раньше ездил на машине, но решил пересесть на электровелосипед, чтобы помочь окружающей среде. Это отличный выбор для экологичного транспорта! К тому же, ездить на велосипеде очень приятно! Спасибо за качество и доступные цены!',
    image: '/images/bicycles/review_bicycles3.jpeg',
  },
];

export default function Phone6() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(null);
  const router = useRouter();
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    loadTikTokPixels([
      PIXEL.bicycles,
      PIXEL_2.bicycles,
      PIXEL_3.bicycles,
      PIXEL_4.bicycles,
      PIXEL_5.bicycles,
      PIXEL_6.bicycles,
      PIXEL_7.bicycles,
      PIXEL_8.bicycles,
    ]);
  }, []);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/quiz', {
        FIELDS: {
          ...data.FIELDS,
          UTM_SOURCE: utm_source || '',
          UTM_MEDIUM: utm_medium || '',
          UTM_CAMPAIGN: utm_campaign || '',
          UTM_CONTENT: utm_content || '',
          UTM_TERM: (ad || '') + (ttclid || ''),
        },
      });

      if (response.data?.success) {
        router.push('https://technobar.by/thank-you?source=bicycles');
      } else {
        alert('Форма отправлена слишком часто. Попробуйте через минуту.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      if (error.response?.status === 429) {
        alert('Форма уже отправлена. Попробуйте через минуту.');
      } else {
        alert(
          'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const questions = [
    {
      id: 1,
      question: 'Выберите срок рассрочки для расчета платежей!',
      type: 'checkbox',
      options: [
        { value: '1 год', label: '1 год' },
        { value: '2 года', label: '2 года' },
        { value: '3 года', label: '3 года' },
        { value: '4 года', label: '4 года' },
        { value: '5 лет', label: '5 лет' },
        {
          value: 'Нужна консультация',
          label: 'Нужна консультация',
        },
      ],
    },
    {
      id: 5,
      question: 'Выберите тип велосипеда',
      type: 'radio',
      options: [
        { value: 'Горный', label: 'Горный 🚲' },
        { value: 'Городской', label: 'Городской 🚴' },
      ],
    },
    {
      id: 2,
      question: 'Рассчитать платежи с первым взносом или без?',
      type: 'radio',
      options: [
        { value: 'с первым взносом', label: 'С первым взносом' },
        { value: 'без первого взноса', label: 'Без первого взноса' },
      ],
    },
    {
      id: 4,
      question: 'На какой ежемесячный платеж рассчитываете?',
      type: 'radio',
      options: [
        { value: 'от 30 до 50 BYN/мес', label: 'от 30 до 50 BYN/мес' },
        { value: 'от 50 до 100 BYN/мес', label: 'от 50 до 100 BYN/мес' },
        { value: 'от 100 до 200 BYN/мес', label: 'от 100 до 200 BYN/мес' },
        { value: 'от 200 BYN/мес', label: 'от 200 BYN/мес' },
      ],
    },

    {
      id: 5,
      question: 'Введите ваш номер телефона',
      type: 'text',
    },
  ];

  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {' '}
        Электрический велосипед в рассрочку со скидкой -50%!{' '}
      </h1>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/bicycles/bicycles_img1.jpg"
            alt="Телефоны"
            width={500}
            height={400}
            priority
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              borderRadius: '20px',
            }}
          />
        </div>

        <div className={styles.textContent}>
          <p className={styles.surveyText}>
            Ответьте всего на 4 вопроса и мы вышлем график платежей с учетом
            скидки -50%
          </p>

          <button
            className={styles.priceButton}
            onClick={() => setIsQuizOpen(true)}
          >
            Пройти тест
          </button>

          <div className={styles.timer}>
            <CountdownTimer />
          </div>

          <ul className={styles.benefits}>
            <li>✅ В рассрочку от 6 месяцев</li>
            <li>✅ Без справок о доходах</li>
            <li>✅ Без первого взноса и переплат</li>
          </ul>
        </div>
      </div>

      <div className={styles.advantagesSection}>
        <div className={styles.advantagesImage}>
          <Image
            src="/images/bicycles/bicycles_img2.jpeg"
            alt="Телефоны"
            width={600}
            height={600}
            priority
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'fill',
              borderRadius: '20px',
            }}
          />
        </div>

        <div className={styles.advantagesList}>
          <h2 className={styles.sectionTitle}>Преимущества нашего магазина</h2>

          {advantages.map((advantage, index) => (
            <div key={advantage.id} className={styles.advantageItem}>
              <span className={styles.advantageNumber}>{index + 1}</span>
              <div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </div>
            </div>
          ))}

          <button
            className={styles.priceButton}
            onClick={() => setIsQuizOpen(true)}
          >
            Пройти тест
          </button>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>ОТЗЫВЫ НАШИХ ПОКУПАТЕЛЕЙ</h2>
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <Image
                src={review.image}
                alt={`Отзыв ${review.author}`}
                width={300}
                height={200}
                className={styles.reviewImage}
              />
              <p className={styles.reviewText}>{review.text}</p>
              <p className={styles.reviewAuthor}>{review.author}</p>
            </div>
          ))}
        </div>
        <button
          className={styles.priceButton}
          onClick={() => setIsQuizOpen(true)}
        >
          Пройти тест
        </button>
      </div>

      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="bicycles"
      />
    </div>
  );
}
