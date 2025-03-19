'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';
import { PIXEL, PIXEL_2, PIXEL_3 } from '@/data/pixel';

const advantages = [
  {
    id: 1,
    title: 'Своя рассрочка от магазина',
    description:
      'Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах. Без банков и поручителей',
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

const benefits = [
  'Рассрочка от 6 месяцев',
  'Без справок о доходах',
  'Без первого взноса и переплат',
];

const reviews = [
  {
    id: 1,
    text: 'Купил ПЭВМ для работы в офисе, и остался очень доволен! Машина работает быстро и стабильно, отлично справляется с обработкой больших объемов данных. Удобный интерфейс и надежная сборка — это именно то, что нужно для продуктивной работы. Рекомендую!',
    image: '/images/pc/reviews_pc_1.png',
  },
  {
    id: 2,
    text: 'ПЭВМ Эльбрус-203 — просто находка для разработчиков! Высокая производительность и надежность делают эту машину идеальной для создания программного обеспечения. Я впечатлена количеством портов и возможностями подключения. Отличный выбор для профессионалов!',
    image: '/images/pc/reviews_pc_2.webp',
  },
  {
    id: 3,
    text: 'Мой выбор — ПЭВМ БК-0010, и я не пожалел! Эта модель идеально подходит для домашних задач и учебы. Простота в использовании и доступная цена — большой плюс. Отлично работает с офисными программами и интернетом. Могу смело рекомендовать всем новичкам',
    image: '/images/pc/reviews_pc_3.webp',
  },
];

export default function PC() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(null);
  const [isVisible, setIsVisible] = useState({});
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.shockproof);
      window.ttq.load(PIXEL_2.shockproof);
      window.ttq.load(PIXEL_3.shockproof);
      window.ttq.page();
    }
  }, []);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    axios
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
        setIsLoading(false);
        router.push('/thank-you?source=pc');
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
        {
          value: 'Нужна консультация',
          label: 'Нужна консультация',
        },
      ],
    },
    {
      id: 3,
      question: 'Выберите подарок ',
      type: 'radio',
      options: [
        { value: 'Мышка и клавиатура', label: 'Мышка и клавиатура' },
        { value: 'Игровые наушники', label: 'Игровые наушники' },
        { value: 'Колонки', label: 'Колонки' },
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>
          ИГРОВЫЕ КОМПЬЮТЕРЫ В РАССРОЧКУ БЕЗ ПЕРВОГО ВЗНОСА И ПЕРЕПЛАТ!
        </h1>
      </div>

      <div
        className={styles.mainSection}
        id="mainSection"
        data-animate="fade-in"
      >
        <div className={styles.textContent}>
          <ul className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.checkmarkItem}>
                {benefit}
              </li>
            ))}
          </ul>

          <div className={styles.timerSection}>
            <p>До конца акции осталось:</p>
            <CountdownTimer />
          </div>

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
        </div>

        <div className={styles.imageContainer}>
          <Image
            src="/images/pc/pc_1.webp"
            alt="PC"
            width={500}
            height={400}
            priority
            className={styles.mainImage}
          />
        </div>
      </div>

      <div
        className={styles.advantagesSection}
        id="advantagesSection"
        data-animate="slide-up"
      >
        <div className={styles.advantagesImage}>
          <Image
            src="/images/pc/pc_2.jpg"
            alt="PC"
            width={500}
            height={400}
            className={styles.featuresImage}
          />
        </div>

        <div className={styles.advantagesList}>
          <h2 className={styles.sectionTitle}>Преимущества нашего магазина</h2>

          {advantages.map((advantage, index) => (
            <div
              key={advantage.id}
              className={`${styles.advantageItem} ${styles.fadeIn}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
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

      <div
        className={styles.reviewsSection}
        id="reviewsSection"
        data-animate="fade-in"
      >
        <h2 className={styles.reviewsTitle}>ОТЗЫВЫ НАШИХ ПОКУПАТЕЛЕЙ</h2>
        <div className={styles.reviewsGrid}>
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`${styles.reviewCard} ${styles.fadeIn}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <Image
                src={review.image}
                alt="Отзыв покупателя"
                width={300}
                height={200}
                className={styles.reviewImage}
              />
              <p className={styles.reviewText}>{review.text}</p>
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
        loading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="Броне Телефон"
      />
    </div>
  );
}
