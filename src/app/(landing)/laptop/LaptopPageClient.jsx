'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/shared/ui/countdown-timer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/features/quiz/ui/Quiz';
import {
  PIXEL,
  PIXEL_10,
  PIXEL_11,
  PIXEL_12,
  PIXEL_13,
  PIXEL_14,
  PIXEL_15,
  PIXEL_2,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
  PIXEL_7,
  PIXEL_8,
  PIXEL_9,
} from '@/shared/config/pixel';
import { loadTikTokPixels } from '@/shared/utils';
import Script from 'next/script';

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
      'Мы сотрудничаем с заводами-производителями, поэтому наши цены приятные по всему рынку Беларуси!',
  },
  {
    id: 3,
    title: 'Гарантия 5 лет',
    description:
      'На все товары у нас есть расширенная гарантия от магазина. У нас собственный сервисный центр и большой склад запчастей',
  },
];

const reviews = [
  {
    id: 1,
    author: 'Ольга, г. Барановичи',
    text: 'Ноутбук просто шикарный! Стильный дизайн, мощный процессор. Отлично подходит для работы и учебы. Photoshop, монтаж и все программы запускаются быстро. И экран большой, смотреть фильмы - одно удовольствие',
    image: '/laptop_comment_img.jpg',
  },
  {
    id: 2,
    author: 'Иван, д. Воропаево',
    text: 'Купил этот ноутбук полгода назад, и он стал моим верным помощником. Быстрый, удобный, батарея держит долго. Экран яркий, клавиатура удобная. Игры тоже без проблем. С этапом доставки тоже все хорошо. Рекомендую!',
    image: '/laptop_comment-2_img.webp',
  },
  {
    id: 3,
    author: 'Антон, г.Минск',
    text: 'Долго выбирал ноутбук, и не зря остановился на этом. Все что нужно для работы есть. Уже без малого год работает отлично, не тормозит не шумит! Батарея держит заряд до 5 часов, что очень удобно.',
    image: '/laptop_comment-3_img.webp',
  },
];

export default function Laptop() {
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
        router.push('https://technobar.by/thank-you?source=laptop');
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
  useEffect(() => {
    loadTikTokPixels([
      PIXEL.laptop,
      PIXEL_2.laptop,
      PIXEL_3.laptop,
      PIXEL_4.laptop,
      PIXEL_5.laptop,
      PIXEL_6.laptop,
      PIXEL_7.laptop,
      PIXEL_8.laptop,
      PIXEL_9.laptop,
      PIXEL_10.laptop,
      PIXEL_11.laptop,
      PIXEL_12.laptop,
      PIXEL_13.laptop,
      PIXEL_14.laptop,
      PIXEL_15.laptop,
    ]);
  }, []);

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
        { value: 'Мышка с сумкой', label: 'Мышка с сумкой 🖱' },
        { value: 'Телефон', label: 'Телефон 📱' },
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

  if (!now) return <Loading />;

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '748574324825711');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=748574324825711'&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.discountBanner}>
            СКИДКА -50% • СКИДКА -50% • СКИДКА -50% • СКИДКА -50% •
          </div>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Ноутбуки в рассрочку
              <br />
              со скидкой -50%
            </h1>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src="/laptop_img-1.jpg"
              alt="Ноутбуки"
              width={500}
              height={400}
              priority
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
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
              Узнать цену
            </button>

            <div className={styles.timer}>
              <CountdownTimer />
            </div>

            <ul className={styles.benefits}>
              <li>✅ Рассрочку от 6 месяцев</li>
              <li>✅ Без справок о доходах</li>
              <li>✅ Без первого взноса и переплат</li>
              <li>
                🎁 В подарок к каждому заказу: Новый телефон или мышка с сумкой
                !
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.advantagesSection}>
          <div className={styles.advantagesImage}>
            <Image
              src="/laptop_img-2.webp"
              alt="Ноутбуки"
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

            <button
              className={styles.priceButton}
              onClick={() => setIsQuizOpen(true)}
            >
              Узнать цену
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
            Узнать цену
          </button>
        </div>
        <Quiz
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          isLoading={isLoading}
          questions={questions}
          onSubmit={handleQuizSubmit}
          successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
          title="laptop"
        />
      </div>
    </>
  );
}
