'use client';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import Quiz from '@/components/quiz/Quiz';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { PIXEL, PIXEL_2, PIXEL_3 } from '@/data/pixel';

const reviews = [
  {
    id: 1,
    author: 'Игорь, Брест',
    text: 'Справляется с тяжелой землей. У нас тяжелая земля, обычные мотоблоки не тянут. Взял МТЗ, потому что у него мощный мотор. Тянет отлично, фрезы крутит, землю ворочает как надо. Пока доволен.',
    image: '/images/moto/moto_reviews_1.jpg',
  },
  {
    id: 2,
    author: 'Иван, Витебск',
    text: 'Работает как надо! Купил МТЗ, потому что участок большой. Сразу взял к нему плуг. Машина мощная, легко идет по земле. Бензина ест немного, на весь день хватает. Хорошая штука для работы.',
    image: '/images/moto/reviews_moto_2.jpg',
  },
  {
    id: 3,
    author: 'Максим, Мозырь',
    text: 'Shtenli 1030 приобрел для обработки своего огорода. Для небольших площадей его хватает с головой. Прост в управлении и обслуживании. Легко заводится даже в холодную погоду. Отличный вариант!',
    image: '/images/moto/reviews_moto_3.png',
  },
];

const advantages = [
  {
    id: 1,
    title: 'Рассрочка с минимальными платежами',
    description:
      'Срок до 5 лет без переплат. Без выезда в магазин, справок и поручителей. Оформим за 10 минут и предоставим все документы',
  },
  {
    id: 2,
    title: 'Оптовые цены',
    description:
      'Работаем напрямую с заводами — держим цены ниже рынка по Беларуси.',
  },
  {
    id: 3,
    title: 'Гарантия 5 лет',
    description:
      'Собственный сервисный центр и склад запчастей. Быстрый ремонт и обмен.',
  },
  {
    id: 4,
    title: 'Бесплатная доставка до 7 дней ',
    description:
      'Все документы подписываете после осмотра и проверки на месте получения',
  },
];

const gifts = [
  { id: 1, title: 'Плуг', image: '/images/motoblock/gift_plug.webp' },
  { id: 2, title: 'Окучник', image: '/images/motoblock/gift_ok.webp' },
  { id: 3, title: 'Фреза', image: '/images/motoblock/gift_freza.webp' },
  { id: 4, title: 'Сцепка', image: '/images/motoblock/gift_scepk.webp' },
];

// --- Компонент страницы ---
export default function MotoblocksLandingPage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(null);
  const router = useRouter();
  const params = useSearchParams();

  const utm = useMemo(
    () => ({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_content: params.get('utm_content') || '',
      utm_campaign: params.get('utm_campaign') || '',
      ad: params.get('ad') || '',
      ttclid: params.get('ttclid') || '',
    }),
    [params]
  );

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.load(PIXEL.motoblok2);
      window.ttq.load(PIXEL_2.motoblok2);
      window.ttq.load(PIXEL_3.motoblock2);
      window.ttq.page();
    }
  }, []);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(
        'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        {
          FIELDS: {
            ...data.FIELDS,
            UTM_SOURCE: utm.utm_source,
            UTM_MEDIUM: utm.utm_medium,
            UTM_CAMPAIGN: utm.utm_campaign,
            UTM_CONTENT: utm.utm_content,
            UTM_TERM: `${utm.ad}${utm.ttclid}`,
          },
        }
      );
      setIsQuizOpen(false);
      router.push('/thank-you?source=motoblok2');
    } catch (e) {
      console.error('Lead submit error', e);
      alert(
        'Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз, пожалуйста.'
      );
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
        { value: 'Нужна консультация', label: 'Нужна консультация' },
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
        { value: 'Viber', label: 'Viber' },
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

  if (!now) return <Loading />;

  return (
    <div className={styles.page}>
      {/* Sticky CTA (мобилка) */}
      <div className={styles.stickyBar}>
        <button
          className={styles.stickyBtn}
          onClick={() => setIsQuizOpen(true)}
        >
          Узнать цену и забрать подарок
        </button>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.badge}>
            Рассрочка до 60 месяцев без скрытых платежей и комиссий
          </p>
          <h1 className={styles.title}>
            Распродажа мотоблоков
            <span className={styles.titleAccent}> с 4 подарками</span>
          </h1>
          <p className={styles.subtitle}>
            <b>Плуг, окучник, борона и сцепка</b> — дарим до конца месяца.
            Оформление за 10 минут. Доставка по РБ до 7 дней.
          </p>

          <ul className={styles.kpis}>
            <li>
              <b>627</b> довольных клиентов за последний месяц
            </li>
            <li>
              <b>4</b> года продаём напрямую с завода
            </li>
            <li>
              <b>№1</b> по оценке клиентов в 2024
            </li>
          </ul>

          <div className={styles.timerWrap}>
            <span>До конца акции осталось:</span>
            <CountdownTimer />
          </div>

          <div className={styles.ctaRow}>
            <button
              className={styles.primaryBtn}
              onClick={() => setIsQuizOpen(true)}
            >
              Узнать цену
            </button>
            <span className={styles.secureNote}>
              Без спама • Отмена в 1 клик
            </span>
          </div>
        </div>

        <div className={styles.heroMedia}>
          <Image
            src="/images/motoblock/bg_motobloc.jpeg.webp"
            alt="Мотоблоки"
            width={900}
            height={900}
            priority
            className={styles.heroImg}
          />
        </div>
      </section>

      {/* Преимущества */}
      <section className={styles.advantages}>
        <div className={styles.advantagesHead}>
          <h2 className={styles.h2}>Почему у нас выгоднее</h2>
          <p className={styles.lead}>
            Оформим рассрочку без переплат и доставим быстрее конкурентов.
            Сервис и гарантия — у нас.
          </p>
        </div>
        <div className={styles.advantagesGrid}>
          {advantages.map((a, i) => (
            <div className={styles.advCard} key={a.id}>
              <div className={styles.advNum}>{i + 1}</div>
              <div>
                <h3 className={styles.advTitle}>{a.title}</h3>
                <p className={styles.advDesc}>{a.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.center}>
          <button
            className={styles.primaryBtn}
            onClick={() => setIsQuizOpen(true)}
          >
            Рассчитать платеж
          </button>
        </div>
      </section>

      {/* Подарки */}
      <section className={styles.gifts}>
        <h2 className={styles.h2}>4 подарка каждому покупателю</h2>
        <div className={styles.giftsGrid}>
          {gifts.map((g) => (
            <div className={styles.giftCard} key={g.id}>
              <div className={styles.giftTitle}>{g.title}</div>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          Подарки суммарной стоимостью ~525 BYN — только до конца месяца
        </p>
      </section>

      {/* Доверие */}
      <section className={styles.trust}>
        <div className={styles.trustInner}>
          <div className={styles.trustLeft}>
            <h2 className={styles.h2}>Гарантия 5 лет и свой сервис</h2>
            <ul className={styles.trustList}>
              <li>Собственный сервисный центр и склад запчастей</li>
              <li>Обмен/ремонт без лишней бюрократии</li>
              <li>Оплата после осмотра — вы в безопасности</li>
            </ul>
            <button
              className={styles.primaryBtn}
              onClick={() => setIsQuizOpen(true)}
            >
              Подобрать мотоблок
            </button>
          </div>
          <div className={styles.trustRight}>
            <Image
              src="/images/moto/motoblock_1.jpeg"
              alt="Сервис и гарантия"
              width={700}
              height={520}
              className={styles.trustImg}
            />
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className={styles.reviews}>
        <h2 className={styles.h2}>Отзывы покупателей</h2>
        <p className={styles.lead}>
          Скриншоты реальных клиентов. Больше отзывов по запросу в мессенджер.
        </p>
        <div className={styles.reviewsGrid}>
          {reviews.map((r) => (
            <article className={styles.reviewCard} key={r.id}>
              <div className={styles.reviewImgWrap}>
                <Image
                  src={r.image}
                  alt={`Отзыв: ${r.author}`}
                  width={320}
                  height={240}
                  className={styles.reviewImg}
                />
              </div>
              <p className={styles.reviewText}>“{r.text}”</p>
              <p className={styles.reviewAuthor}>{r.author}</p>
            </article>
          ))}
        </div>
        <div className={styles.center}>
          <button
            className={styles.primaryBtn}
            onClick={() => setIsQuizOpen(true)}
          >
            Получить цену
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <h2 className={styles.h2}>Частые вопросы</h2>
        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary>Как оформить рассрочку 0% без первого взноса?</summary>
            <p>
              Заполните 3 шага в квизе — менеджер подберёт лучший вариант: с
              первым взносом или без, на срок от 1 до 5 лет.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Сколько занимает доставка?</summary>
            <p>
              Обычно 24 часа по РБ. Курьер поможет осмотреть и проверить
              технику.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Какие документы нужны?</summary>
            <p>Только паспорт. Остальное оформим сами за 10 минут.</p>
          </details>
          <details className={styles.faqItem}>
            <summary>Можно ли протестировать перед оплатой?</summary>
            <p>Да, проверяете комплектацию и запуск. Оплата — после осмотра.</p>
          </details>
        </div>
      </section>

      {/* Финальный призыв */}
      <section className={styles.finalCta}>
        <h2 className={styles.h2}>
          Успейте забрать с подарками и скидкой -50%
        </h2>
        <p className={styles.lead}>
          Ответьте на 3 вопроса — вышлем расчёт платежей и закрепим подарок.
        </p>
        <button
          className={styles.primaryBtn}
          onClick={() => setIsQuizOpen(true)}
        >
          Узнать цену
        </button>
      </section>

      {/* Модал-квиз (ВАШ) */}
      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="motoblok_landing"
      />
    </div>
  );
}
