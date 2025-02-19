'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';
import { PIXEL, PIXEL_2 } from '@/data/pixel';

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
    text: 'Отличный смартфон для путешествий или работы в тяжелых условиях, можно не бояться того, что ребенок уронит его в ванной, со своими параметрами справляется на ура. Приятная особенность - защита от воды, пыли, грязи и стекло сапфир!!! Камера ночного видения работает фото отличные. Советую!',
    image: '/shockproof_phone_comment_2.webp',
  },
  {
    id: 2,
    text: 'Скорее отличная. И что мне совсем понравилось, так это настоящее живое издение, а бы сказал это настроенный ПНЖ. Надо было брать 16гб версию, так как я металлоискатель, телефон работает очень долго. Брать можно смело. Сервис отличный, оперфоны даже, уже иду в 3 тур со временем, не это разные! Можно вести подводную съемку. Если вы фанат рыбалки, охоты и туризма, то этот смартфон для вас. Магазин рекомендую!',
    image: '/shockproof_phone_comment_3.webp',
  },
  {
    id: 3,
    text: 'Неубиваемый телефон, хорошая защита. Большой аккумулятор. Камера хорошо снимает вообще огонь! Особенно со всех падал от земли до и на стройке, и тем самым машина в минус 20, и до плюса. Все отлично работает. Доставка быстрая, дают гарантию, закидывают помощь по всем вопросам - спасибо!',
    image: '/shockproof_phone_comment.webp',
  },
];

export default function ShockproofPhone() {
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
        router.push('/thank-you?source=shockproof');
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

  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>
          Противоударные телефоны
          <br />в Рассрочку со скидкой -50%
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
            src="/shockproof_phone_img.jpg"
            alt="Противоударный телефон"
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
            src="/shockproof_phone_img-2.jpg"
            alt="Особенности противоударного телефона"
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
