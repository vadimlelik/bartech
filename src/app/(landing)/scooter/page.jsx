'use client';

import Loading from '@/app/loading';
import { PIXEL, PIXEL_2, PIXEL_3, PIXEL_4 } from '@/data/pixel';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Quiz from '@/components/quiz/Quiz';

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
      'Мы сотрудничаем с заводами-производителями, поэтому у нас самые доступные цены в Беларуси!',
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
    author: 'Сергей, Гродно',
    text: '3 дня назад привезли мне мой электроскутер, который купил в рассрочку в Технобар. Ездить на нем одно удовольствие. Быстро разгоняется, маневренный и самое главное не нужно заправлять. Просто ставлю батарею на зарядку пока сам на работе и все. Отдельное спасибо менеджеру Евгению, за то что подобрал условия рассрочки прямо под меня, буду платить небольшими частями. Очень доволен магазином, быстрой доставкой и обслуживанием. Рекомендую!',
    image: '/images/scooter/reviews_scooter_1.jpg',
  },
  {
    id: 2,
    author: 'Иван, Витебск',
    text: 'Этот электроскутер с корзинкой просто находка века. Легкий, быстро разгоняется и легко управляется. А главное, что не нужно заправлять и можно ездить без прав. Идеально подходит, чтобы быстро добираться на работу и съездить в магазин. Спасибо магазину, что предложили персональную скидку. Рассрочку оформили быстро и бесплатно доставили прямо домой. Это очень удобно',
    image: '/images/scooter/reviews_scooter_2.jpg',
  },
  {
    id: 3,
    author: 'Максим, Мозырь',
    text: 'Долго думал какой электроскутер себе купить. В итоге остановился на citycoco, спасибо менеджерам за помощь в выборе и за быстрое оформление рассрочки. Уже неделю езжу на нем на работу и в соседнюю деревню в магазин, очень удобно. Широкие колеса, хорошо едет по песку и легко управляется. Батарейки хватает на 30 км езды. Этого хватает на несколько дней. Оставлял заявку в тиктоке в 4 разных магазина и искал тех, кто предложит лучшие условия. В Технобар цена оказалась на порядок ниже, чем предлагают другие. Да и еще доставка бесплатная в удобное время и в любую точку Беларуси. Однозначно рекомендую магазин. Если покупать, то только тут!',
    image: '/images/scooter/reviews_scooter_3.jpg',
  },
];

export default function MotoBlok() {
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
      window.ttq.load(PIXEL.scooter);
      window.ttq.load(PIXEL_2.scooter);
      window.ttq.load(PIXEL_3.scooter);
      window.ttq.load(PIXEL_4.scooter);
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
        router.push('/thank-you?source=scooter');
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
      <div className={styles.text}>
        <h1 className={styles.title}>
          Электроскутеры в рассрочку cо скидкой до 50%
        </h1>
        <h3 className={styles.description}>Шлем в подарок!</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/scooter/scooter_1.jpg"
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
            src="/images/scooter/scooter_2.jpg"
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
