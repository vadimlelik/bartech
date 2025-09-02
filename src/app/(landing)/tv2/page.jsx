'use client';

import { useEffect, useState } from 'react';
import styles from './tvPage.module.css';
import Button from '@/app/(shop)/components/button/Button';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { PIXEL, PIXEL_3 } from '@/data/pixel';
import Quiz from '@/components/quiz/Quiz';

export default function CatalogPage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const closeQuiz = () => {
    setIsQuizOpen(false);
  };

  const questions = [
    {
      id: 1,
      question: 'Выберите бренд телевизора!',
      type: 'radio',
      options: [
        { label: 'Samsung', value: 'Samsung' },
        { label: 'TCL', value: 'TCL' },
        { label: 'LG', value: 'LG' },
        { label: 'Sony', value: 'Sony' },
        { label: 'Panasonic', value: 'Panasonic' },
        { label: 'Philips', value: 'Philips' },
        { label: 'Xiaomi', value: 'Xiaomi' },
      ],
    },
    {
      id: 3,
      question: 'На какой ежемесячный платеж Вы рассчитываете?',
      type: 'radio',
      options: [
        { label: 'от 30 до 50 BYN/мес', value: 'от 30 до 50 BYN/мес' },
        { label: 'от 50 до 100 BYN/мес', value: 'от 50 до 100 BYN/мес' },
        { label: 'от 100 до 200 BYN/мес', value: 'от 100 до 200 BYN/мес' },
        { label: 'от 200  BYN/мес', value: 'от 200  BYN/мес' },
      ],
    },
    {
      id: 4,
      question:
        'Укажите на какой номер прислать каталог с ценами и графиками платежей',
      type: 'text',
    },
  ];
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.card}`);

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.tv);
      window.ttq.load(PIXEL_3.tv);
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
        router.push('/thank-you?source=tv_1');
      });
  };
  return (
    <div>
      <main className={styles.main}>
        {/* Первая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="images/tv/tv2.webp" alt="Техника" />
          <div className={styles.cardContent}>
            <span className={styles.discount}>
              <h2>Мы снизили цену в два раза!</h2>
            </span>
            <p>Любая техника — рассрочка без переплат:</p>
            <ul>
              <li>Смарт-часы и гаджеты</li>
              <li>Крупная бытовая техника</li>
              <li>Аксессуары</li>
              <li>Игровые приставки</li>
              <li>Аудио</li>
            </ul>
            <p>Рассрочка — от 3 до 24 месяцев.</p>
          </div>
        </div>

        {/* Вторая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <video
            autoPlay
            loop
            muted
            src="images/tv/Sequence_01_106.mp4"
            type="video/mp4"
            className={styles.video}
          />
          <div className={styles.cardContent}>
            <h2>Рассчитайте ежемесячный платеж прямо на сайте</h2>
            <ol>
              <li>Выберите технику из каталога</li>
              <li>Оставьте заявку за 3 минуты</li>
              <li>Получите решение онлайн</li>
            </ol>
            <p>✔ Рассрочка от магазинов без банка</p>
            <p>✔ До 24 мес.</p>
            <p>✔ Без скрытых комиссий</p>
          </div>
        </div>

        {/* Третья карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="images/tv/tv2_1.webp" alt="Техника" />
          <div className={styles.cardContent}>
            <h2>Характеристики</h2>
            <ul>
              <li>Производитель: Samsung</li>
              <li>Диагональ: 55&quot;</li>
              <li>Разрешение: 4K</li>
              <li>HDR: есть</li>
              <li>Smart TV: есть</li>
            </ul>
          </div>
        </div>
      </main>

      <div className={styles.bottomBtn}>
        <Button
          label="Купить в рассрочку"
          color="orange"
          size="large"
          onClick={() => setIsQuizOpen(true)}
        />
      </div>
      <Quiz
        isOpen={isQuizOpen}
        isLoading={isLoading}
        onClose={closeQuiz}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="TV_1"
      />
    </div>
  );
}
