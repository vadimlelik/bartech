'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/shared/ui/countdown-timer/CountdownTimer';
import Quiz from '@/features/quiz/ui/Quiz';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PIXEL,
  PIXEL_10,
  PIXEL_11,
  PIXEL_12,
  PIXEL_13,
  PIXEL_14,
  PIXEL_15,
  PIXEL_16,
  PIXEL_17,
  PIXEL_18,
  PIXEL_19,
  PIXEL_2,
  PIXEL_20,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
  PIXEL_7,
  PIXEL_8,
  PIXEL_9,
} from '@/shared/config/pixel';
import { loadTikTokPixels } from '@/shared/utils';

const reviews = [
  {
    name: 'Максим, 29 лет',
    text: 'Спасибо магазину за телефон! Много думала! В итоге купила в рассрочку. Посоветовала подруга Ваш магазин - буду всем рекомендовать.',
    image: '/phone_comment_img.jpg',
  },
  {
    name: 'Сергей, 34 года',
    text: 'Спасибо менеджеру Виталию. Помогал мне подобрать телефон, который подходит под все мои нужды. Платеж небольшой, плачу с комфортом. Одобрили быстро! СПАСИБО',
    image: '/commentLogo-2.webp',
  },
  {
    name: 'Анастасия, 42 года',
    text: 'Разбила свой телефон, а денег на покупку не было. Денег не было на покупку нового и как мне повезло узнать о вашем магазине. Платеж всего 39 рублей, а телефон уже у меня. Супер!',
    image: '/commentLogo-3.webp',
  },
];

const advantages = [
  {
    id: 1,
    title: 'Своя рассрочка от магазина',
    description:
      'Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах, без банков и поручителей',
  },
  {
    id: 2,
    title: 'Оптовые цены',
    description:
      'Мы сотрудничаем с заводами-производителями, поэтому наши цены самые приятные по всему рынку Беларуси!',
  },
  {
    id: 3,
    title: 'Гарантия 5 лет',
    description:
      'На все товары у нас есть расширенная гарантия от магазина. У нас собственный сервисный центр и большой склад запчастей',
  },
];

export default function Phone4() {
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
        router.push('https://technobar.by/thank-you?source=phone3');
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

  const closeQuiz = () => {
    setIsQuizOpen(false);
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
      id: 2,
      question: 'Выберите подарок',
      type: 'radio',
      options: [
        { value: 'Беспроводные наушники', label: 'Беспроводные наушники 🎧' },
        { value: 'PowerBank', label: 'PowerBank 🔋' },
      ],
    },
    {
      id: 3,
      question: 'Рассчитать платежи с первым взносом или без?',
      type: 'radio',
      options: [
        { value: 'с первым взносом', label: 'С первым взносом' },
        { value: 'без первого взноса', label: 'Без первого взноса' },
      ],
    },
    {
      id: 4,
      question: 'Куда вам выслать примерный расчет ежемесячных платежей?',
      type: 'radio',
      options: [
        { value: 'Viber', label: ' Viber' },
        { value: 'Telegram', label: 'Telegram' },
        { value: 'SMS', label: 'SMS' },
        {
          value: 'Нужна консультация по телефону',
          label: 'Нужна консультация по телефону',
        },
      ],
    },

    {
      id: 5,
      question: 'Введите ваш номер телефона',
      type: 'text',
    },
  ];

  useEffect(() => {
    loadTikTokPixels([
      PIXEL.phone3,
      PIXEL_2.phone3,
      PIXEL_3.phone3,
      PIXEL_4.phone3,
      PIXEL_5.phone3,
      PIXEL_6.phone3,
      PIXEL_7.phone3,
      PIXEL_8.phone3,
      PIXEL_9.phone3,
      PIXEL_10.phone3,
      PIXEL_11.phone3,
      PIXEL_12.phone3,
      PIXEL_13.phone3,
      PIXEL_14.phone3,
      PIXEL_15.phone3,
      PIXEL_16.phone3,
      PIXEL_17.phone3,
      PIXEL_18.phone3,
      PIXEL_19.phone3,
      PIXEL_20.phone3,
    ]);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            Новый смартфон в<br />
            Рассрочку со скидкой -50%
          </h2>

          <ul className={styles.benefits}>
            <li> Рассрочку от 6 месяцев</li>
            <li> Без справок о доходах</li>
            <li> Без первого взноса и переплат</li>
          </ul>

          <div className={styles.timerBlock}>
            <p>До конца акции осталось:</p>
            <CountdownTimer />
          </div>

          <p className={styles.quizPrompt}>
            Ответьте всего на 3 вопроса и мы вышлем график платежей с учетом
            скидки -50%
          </p>
          <div className={styles.actionButtonWrapper}>
            <button
              className={styles.actionButton}
              onClick={() => setIsQuizOpen(true)}
            >
              Узнать цену
            </button>
          </div>
        </div>

        <div className={styles.heroImage}>
          <Image
            src="/img_phone4.png"
            alt="Телефоны"
            width={500}
            height={1000}
            priority
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '20px',
            }}
          />
        </div>
      </div>

      <div className={styles.advantagesSection}>
        <div className={styles.advantagesImage}>
          <Image
            src="/Xiaomi-Redmi-14C.jpg"
            alt="Смартфоны"
            width={500}
            height={1000}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        <div className={styles.advantagesList}>
          <h2 className={styles.sectionTitle}>
            Преимущества
            <br />
            нашего магазина
          </h2>

          {advantages.map((advantage, index) => (
            <div key={advantage.id} className={styles.advantageItem}>
              <span className={styles.advantageNumber}>{index + 1}</span>
              <div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </div>
            </div>
          ))}

          <div className={styles.actionButtonWrapper}>
            <button
              className={styles.actionButton}
              onClick={() => setIsQuizOpen(true)}
            >
              Узнать цену
            </button>
          </div>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>ОТЗЫВЫ НАШИХ ПОКУПАТЕЛЕЙ</h2>
        <p className={styles.reviewsSubtitle}>
          Более 1000+ довольных клиентов уже приобрели смартфоны в нашем
          магазине
        </p>

        <div className={styles.reviewsGrid}>
          {reviews.map((review, index) => {
            return (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewImageWrapper}>
                  <Image
                    src={review.image}
                    alt={`Отзыв от ${review.name}`}
                    width={300}
                    height={300}
                    className={styles.reviewImage}
                  />
                  <div className={styles.reviewImageOverlay} />
                </div>
                <p className={styles.reviewText}>{review.text}</p>
                <p className={styles.reviewAuthor}>{review.name}</p>
              </div>
            );
          })}
        </div>

        <button
          className={styles.actionButton}
          onClick={() => setIsQuizOpen(true)}
        >
          Получить такой же телефон
        </button>
      </div>

      <Quiz
        isOpen={isQuizOpen}
        onClose={closeQuiz}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="Phone3"
      />
    </div>
  );
}
