'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import Quiz from '@/components/quiz/Quiz';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { PIXEL, PIXEL_2, PIXEL_3 } from '@/data/pixel';
import { loadTikTokPixels } from '@/shared/utils';

const reviews = [
  {
    id: 1,
    author: 'Игорь, Брест ',
    text: 'Справляется с тяжелой землей. У нас тяжелая земля, обычные мотоблоки не тянут.Взял МТЗ, потому что у него мощный мотор. Тянет отлично, фрезы крутит, землю ворочает как надо. Пока доволен.',
    image: '/images/moto/moto_reviews_1.jpg',
  },
  {
    id: 2,
    author: 'Иван, Витебск',
    text: 'Работает как надо! Купил МТЗ потому что участок большой. Сразу взял к нему плуг. Машина мощная, легко идет по земле. Бензина ест немного, на весь день хватает. Хорошая штука для работы',
    image: '/images/moto/reviews_moto_2.jpg',
  },
  {
    id: 3,
    author: 'Максим, Мозырь',
    text: 'Shtenli 1030 приобрел для обработки своего огорода.Двигатель немного слабее, чем у старших моделей, но для небольших площадей его хватает с головой. Прост в управлении и обслуживании. Понравилось, что легко заводится даже в холодную погоду. Отличный вариант!',
    image: '/images/moto/reviews_moto_3.png',
  },
];

const advantages = [
  {
    id: 1,
    title: 'Рассрочка с доступными платежами',
    description:
      'Срок рассрочки до 5 лет без переплат. Не нужны справки о доходах, без банков и поручителей',
  },
  {
    id: 2,
    title: 'Оптовые цены',
    description:
      'Мы сотрудничаем с заводами-производителями, поэтому продаем мотоблоки без наценок и переплат',
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
        setIsQuizOpen(false);
        setIsLoading(false);
        router.push('/thank-you?source=motoblock1');
      });
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
      question: 'Выберите Подарок',
      type: 'radio',
      options: [
        { value: 'Окучник', label: 'Окучник' },
        { value: 'Плуг', label: 'Плуг' },
        { value: 'Фреза', label: 'Фреза' },
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
      question:
        'Укажите на какой номер прислать каталог с ценами и графиками платежей',
      type: 'text',
    },
  ];
  useEffect(() => {
    loadTikTokPixels([PIXEL.motoblok1, PIXEL_2.motoblok1, PIXEL_3.motoblock1]);
  }, []);
  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            РАСПРОДАЖА МОТОБЛОКОВ В РАССРОЧКУ С ПЕРВЫМ ПЛАТЕЖОМ ТОЛЬКО ЧЕРЕЗ 31
            ДЕНЬ
          </h2>
          <p className={styles.heroDescription}>
            <span className={styles.bold}>ПЛУГ, ОКУЧНИК, БОРОНА, СЦЕПКА</span>
            <br /> - 4 подарка стоимостью 525 рублей дарим каждому до конца
            этого месяца
          </p>

          <ul className={styles.benefits}>
            <li className={styles.benefit}>
              <span className={styles.bold}>627</span>Довольных клиентов за
              последний месяц
            </li>
            <li className={styles.benefit}>
              <span className={styles.bold}>4</span>Года продаем мотоблоки МТЗ
              напрямую с завода в РБ
            </li>
            <li className={styles.benefit}>
              <span className={styles.bold}> до 5 лет</span> Расширенной гарантии от магазина
            </li>
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
            src="/images/motoblock/bg_motobloc.jpeg.webp"
            alt="Мотоблоки"
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
            src="/images/moto/motoblock_1.jpeg"
            alt="Мотоблоки"
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
                <p className={styles.reviewAuthor}>{review.author}</p>
              </div>
            );
          })}
        </div>

        <button
          className={styles.actionButton}
          onClick={() => setIsQuizOpen(true)}
        >
          Узнать цену
        </button>
      </div>

      <Quiz
        isOpen={isQuizOpen}
        onClose={closeQuiz}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="motoblok_1"
      />
    </div>
  );
}
