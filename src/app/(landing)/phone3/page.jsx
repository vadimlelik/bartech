'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import Quiz from '@/components/quiz/Quiz';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PIXEL } from '@/data/pixel';

const reviews = [
  {
    name: 'Максим, 29 лет',
    text: 'Спасибо магазину за телефон! Много думала! В итоге купила в рассрочку. Посоветовала подруга Ваш магазин - буду всем рекомендовать.',
    image: '/commentLogo-1.jpg',
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

export default function Phone4() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const router = useRouter();

  const [now, setNow] = useState(null);

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
        router.push('/thank-you?source=phone4');
      });
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

  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.phone3);
      window.ttq.page();
    }
  }, []);
  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>НАША РАССРОЧКА ДОСТУПНА ВСЕМ</h1>

      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            Новый смартфон в<br />
            Рассрочку со скидкой -50%
          </h2>

          <ul className={styles.benefits}>
            <li> Рассрочку одобряем всем</li>
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
            alt="Смартфоны"
            width={500}
            height={400}
            priority
          />
        </div>
      </div>

      <div className={styles.advantagesSection}>
        <div className={styles.advantagesImage}>
          <Image
            src="/img_phone4_2.webp"
            alt="Смартфоны"
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
        onClose={() => setIsQuizOpen(false)}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
      />
    </div>
  );
}
