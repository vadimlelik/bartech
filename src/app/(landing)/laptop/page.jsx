'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';
import { PIXEL, PIXEL_2 } from '@/data/pixel';

const advantages = [
  {
    id: 1,
    title: 'Своя рассрочка от магазина',
    description:
      'Одобряем всем. Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах, без банков и поручителей',
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
  const [now, setNow] = useState(null);
  const router = useRouter();
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const handleQuizSubmit = async (data) => {
    axios
      .post(
        'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        data
      )
      .then(() => {
        router.push('/thank-you?source=laptop');
      });
  };
  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.laptop);
      window.ttq.load(PIXEL_2.laptop);

      window.ttq.page();
    }
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
      ],
    },
    {
      id: 2,
      question: 'Рассчитать платежи с первым взносом или без?',
      type: 'radio',
      options: [
        { value: 'с первым взносом', label: 'С первым взносом' },
        { value: 'без первого взноса', label: 'Без первого взноса' },
        { value: 'Нужна помощь в выборе', label: 'Нужна помощь в выборе' },
      ],
    },
    {
      id: 3,
      question: 'Куда вам выслать примерный расчет ежемесячных платежей?',
      type: 'radio',
      options: [
        { value: 'Viber', label: ' Viber' },
        { value: 'Telegram', label: 'Telegram' },
        { value: 'SMS', label: 'SMS' },
      ],
    },
    {
      id: 4,
      question: 'Введите ваш номер телефона',
      type: 'text',
    },
  ];

  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.discountBanner}>
          СКИДКА -50% • СКИДКА -50% • СКИДКА -50% • СКИДКА -50% •
        </div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            Ноутбуки в Рассрочку
            <br />
            со Скидкой -50%
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
            <li>✅ Рассрочку одобряем всем</li>
            <li>✅ Без справок о доходах</li>
            <li>✅ Без первого взноса и переплат</li>
            <li>🎁 В подарок к каждому заказу: новый телефон или наушники</li>
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
            priority
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
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
      />
    </div>
  );
}
