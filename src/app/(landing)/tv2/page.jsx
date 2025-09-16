'use client';

import { useEffect, useState } from 'react';
import styles from './tvPage.module.css';
import Button from '@/app/(shop)/components/button/Button';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { PIXEL, PIXEL_2 } from '@/data/pixel';
import Quiz from '@/components/quiz/Quiz';
import Script from 'next/script';

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
      window.ttq.load(PIXEL.tv2);
      window.ttq.load(PIXEL_2.tv2);
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
        router.push('/thank-you?source=tv2');
      });
  };
  return (
    <div>
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
          fbq('init', '1210924517744975');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1210924517744975&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <main className={styles.main}>
        {/* Первая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="images/tv/tv3_2.png" alt="Техника" />
          <div className={styles.cardContent}>
            <span className={styles.discount}>
              <h2>
                РАСПРОДАЖА ТЕЛЕВИЗОРОВ В РАССРОЧКУ С ПЕРВЫМ ПЛАТЕЖОМ ТОЛЬКО
                ЧЕРЕЗ 31 ДЕНЬ
              </h2>
            </span>
            <p>ЛЮБАЯ ТЕХНИКА В РАССРОЧКУ БЕЗ ПЕРЕПЛАТ</p>
            <ul>
              <li>✔️ Телевизоры </li>
              <li>✔️ Телефоны </li>
              <li>✔️ Крупная бытовая техника</li>
              <li>✔️ Ноутбуки и компьютеры</li>
              <li>✔️ Игровые приставки</li>
            </ul>
            <p>Рассрочка - от 6 до 60 месяцев</p>
          </div>
        </div>

        {/* Вторая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <video
            autoPlay
            loop
            muted
            src="images/tv/video.MOV"
            type="video/mp4"
            className={styles.video}
            playsInline
            preload="auto"
            controls
            controlsList="nodownload"
            disablePictureInPicture
            disableRemotePlayback
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className={styles.cardContent}>
            <h2>Рассчитайте ежемесячный платеж прямо на сайте</h2>
            <ol>
              <li>Выберите технику из каталога</li>
              <li>Оставьте заявку за 12 секунд</li>
              <li>Получите решение онлайн в течении 10 минут</li>
            </ol>
            <p>✔ Рассрочка онлайн без посещения магазина</p>
            <p>✔ Без скрытых платежей и комиссий.</p>
            <p>✔ До 60 месяцев</p>
          </div>
        </div>

        {/* Третья карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="images/tv/tv3.png" alt="Техника" />
          <div className={styles.cardContent}>
            <h2>Характеристики</h2>
            <ul>
              <li>Производитель: LG</li>
              <li>Диагональ: 55&quot;</li>
              <li>Разрешение: 4K</li>
              <li>HDR: есть</li>
              <li>«Платеж от 49 рублей в месяц»</li>
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
