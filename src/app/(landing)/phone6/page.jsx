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
    title: 'Выгодная рассрочка',
    description:
      'Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах. Без аванса и поручителей',
  },
  {
    id: 2,
    title: 'Оптовые цены',
    description:
      'Мы сотрудничаем с заводами-производителями, поэтому продаем телефоны без наценок и скрытых платежей!',
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
    author: 'Игорь, Минск',
    text: 'Я оформил свой новый iPhone, который приобрел в рассрочку на этом сайте. Удобные условия, выгодные проценты и быстрая доставка. Телефон пришел новый, все как надо, полгода в гарантии 3 года внушает уверенность. Отличный сервис, рекомендую!',
    image: '/phone_comment_img.jpg',
  },
  {
    id: 2,
    author: 'Сергей, Минск',
    text: 'Мне срочно понадобился новый телефон, и я решил заказать его в данном интернет-магазине. Меня приятно удивили как доступные цены и условия. Samsung S24+. Доставили прямо на дом, все проверили, помогли настроить. Пользуюсь телефоном уже месяц, никаких проблем не возникло. Спасибо за оперативность и низкие цены!',
    image: '/commentLogo-3.webp',
  },
  {
    id: 3,
    author: 'Ольга, Мозырь',
    text: 'Я давно хотела приобрести новый iPhone, но не было возможности купить его сразу. Здесь с рассрочкой все прошло отлично! Сумму не пожалела ни секунду! Телефон доставили в течении 2 дней, еще и наушники в подарок. Очень довольна покупкой и сервисом, большое спасибо!',
    image: '/commentLogo-1.jpg',
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
    if (window.ttq) {
      window.ttq.load(PIXEL.phone6);
      window.ttq.load(PIXEL_2.phone6);
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
        router.push('https://technobar.by/thank-you?source=phone6');
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
        <div className={styles.discountBanner}>
          СКИДКА -50% • СКИДКА -50% • СКИДКА -50% • СКИДКА -50% • СКИДКА -50% •
          СКИДКА -50% • СКИДКА -50% • СКИДКА -50% • СКИДКА -50%
        </div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            Мобильные Телефоны в рассрочку
            <br />
            со скидкой до -50%
          </h1>
        </div>

        <div className={styles.imageContainer}>
          <Image
            src="/phone4_img-2.webp"
            alt="Телефоны"
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
            Пройдите тест за 5 минут и заберите телефон в рассрочку со скидкой
            -50%
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
            <li>✅ Без справок о доходах</li>
            <li>✅ Без первого взноса и переплат</li>
          </ul>
        </div>
      </div>

      <div className={styles.advantagesSection}>
        <div className={styles.advantagesImage}>
          <Image
            src="/Xiaomi-Redmi-14C.jpg"
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

        <div className={styles.advantagesList}>
          <h2 className={styles.sectionTitle}>Почему мы?</h2>

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
        title="phone6"
      />
    </div>
  );
}
