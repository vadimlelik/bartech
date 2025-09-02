'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './tvPage.module.css';
import Button from '@/app/(shop)/components/button/Button';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { PIXEL, PIXEL_3 } from '@/data/pixel';
import Quiz from '@/components/quiz/Quiz';

export default function TvLandingPage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(() => 3600 * 6);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  const questions = [
    {
      id: 1,
      question: 'Какой бренд телевизора вам ближе?',
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
      id: 2,
      question: 'На какой ежемесячный платёж вы рассчитываете?',
      type: 'radio',
      options: [
        { label: 'от 30 до 50 BYN/мес', value: 'от 30 до 50 BYN/мес' },
        { label: 'от 50 до 100 BYN/мес', value: 'от 50 до 100 BYN/мес' },
        { label: 'от 100 до 200 BYN/мес', value: 'от 100 до 200 BYN/мес' },
        { label: 'от 200 BYN/мес', value: 'от 200 BYN/мес' },
      ],
    },
    {
      id: 3,
      question:
        'Укажите номер телефона, чтобы получить каталог с ценами и графиками платежей',
      type: 'text',
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.load(PIXEL.tv);
      window.ttq.load(PIXEL_3.tv);
      window.ttq.page();
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Number(progress.toFixed(2)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.card}`);
    if (!cards.length) return;
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
            o.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const closeQuiz = () => setIsQuizOpen(false);
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
      router.push('/thank-you?source=tv_3');
    } catch (err) {
      console.error(err);
      alert(
        'Не удалось отправить заявку — проверьте интернет и попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.progressBarWrapper}
        aria-hidden="true"
        data-progress={scrollProgress}
      >
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.brand}>TechnoBar</h1>
          <p className={styles.tagline}>
            Рассрочка до 60 месяцев без скрытых платежей и комиссий
          </p>
          <div className={styles.headerCta}>
            <Button
              label="Подобрать телевизор"
              color="orange"
              size="small"
              onClick={() => setIsQuizOpen(true)}
            />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="hero-title"
        >
          <div className={styles.mediaWrap}>
            <Image
              src="/images/tv/tv2.webp"
              alt="Современные телевизоры в рассрочку"
              width={1200}
              height={800}
              className={styles.media}
            />
          </div>
          <div className={styles.cardContent}>
            <h2 id="hero-title" className={styles.huge}>
              Современные телевизоры — скидки до <span>50%</span>
            </h2>
            <p className={styles.lead}>
              Рассрочка до <strong>24 месяцев</strong> без банка и скрытых
              комиссий. Бесплатная доставка по РБ и расширенная гарантия.
            </p>

            <div className={styles.ctaRow}>
              <Button
                label="Узнать цену и взять в рассрочку"
                color="orange"
                size="large"
                onClick={() => setIsQuizOpen(true)}
              />
              <button
                className={styles.ghost}
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight / 2,
                    behavior: 'smooth',
                  })
                }
                aria-label="Подробнее о моделях"
              >
                Сравнить модели
              </button>
            </div>

            <div className={styles.kpis}>
              <div className={styles.kpiItem}>
                <strong>627</strong>
                <span>довольных клиентов / мес</span>
              </div>
              <div className={styles.kpiItem}>
                <strong>4</strong>
                <span>года продаём напрямую</span>
              </div>
              <div className={styles.kpiItem}>
                <strong>Гарантия</strong>
                <span>до 2 лет</span>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELIMIT + STOCK */}
        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-live="polite"
        >
          <div className={styles.cardContent}>
            <h3>🔥 Акция ограничена</h3>
            <p className={styles.timer}>{formatTime(countdown)}</p>
            <p className={styles.stockNotice}>
              Осталось <strong>7</strong> телевизоров по акции. Торопитесь!
            </p>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="compare-title"
        >
          <div className={styles.cardContent}>
            <h3 id="compare-title">Сравнение популярных моделей</h3>
            <div className={styles.tableWrapper}>
              <table
                className={styles.table}
                role="table"
                aria-describedby="compare-desc"
              >
                <caption id="compare-desc" className={styles.srOnly}>
                  Таблица сравнения Samsung, LG и Sony
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Характеристика</th>
                    <th scope="col">Samsung</th>
                    <th scope="col">LG</th>
                    <th scope="col">Sony</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Диагональ</td>
                    <td>55″</td>
                    <td>50″</td>
                    <td>65″</td>
                  </tr>
                  <tr>
                    <td>Разрешение</td>
                    <td>4K UHD</td>
                    <td>4K UHD</td>
                    <td>8K UHD</td>
                  </tr>
                  <tr>
                    <td>Smart TV</td>
                    <td>Да</td>
                    <td>Да</td>
                    <td>Да</td>
                  </tr>
                  <tr>
                    <td>Цена в рассрочку</td>
                    <td>от 45 BYN/мес</td>
                    <td>от 40 BYN/мес</td>
                    <td>от 70 BYN/мес</td>
                  </tr>
                  <tr>
                    <td>Подарок при покупке</td>
                    <td>Яндекс станция или робот пылесос</td>
                    <td>Яндекс станция или робот пылесос</td>
                    <td>Яндекс станция или робот пылесос</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="why-title"
        >
          <div className={styles.cardContent}>
            <h3 id="why-title">Почему выбирают нас</h3>
            <ul className={styles.features}>
              <li>Оформление за 5–10 минут</li>
              <li>Доставка и проверка на месте</li>
              <li>Гарантия и собственный сервисный центр</li>
            </ul>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="reviews-title"
        >
          <div className={styles.cardContent}>
            <h3 id="reviews-title">Отзывы наших клиентов</h3>
            <div className={styles.reviewsGrid}>
              <article className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <div>
                    <strong>Иван, Брест</strong>
                    <div className={styles.stars} aria-hidden>
                      ★★★★☆
                    </div>
                  </div>
                </div>
                <p>
                  «Купил Samsung 55″. Оформили рассрочку быстро, курьер проверил
                  всё на месте. Отличная техника — рекомендую.»
                </p>
              </article>

              <article className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <div>
                    <strong>Ольга, Минск</strong>
                    <div className={styles.stars} aria-hidden>
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p>
                  «Брали телевизор для родителей. Всё прозрачно, отсутствие
                  скрытых платежей — большой плюс.»
                </p>
              </article>

              <article className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <div>
                    <strong>Максим, Гомель</strong>
                    <div className={styles.stars} aria-hidden>
                      ★★★★☆
                    </div>
                  </div>
                </div>
                <p>
                  «Быстрая доставка и понятные условия рассрочки. Сервис на
                  высоте.»
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="faq-title"
        >
          <div className={styles.cardContent}>
            <h3 id="faq-title">Частые вопросы</h3>
            <details className={styles.faqItem}>
              <summary>Какие документы нужны для оформления рассрочки?</summary>
              <p>
                Только паспорт и телефон. В редких случаях — справка о доходах
                (об этом заранее сообщит менеджер).
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary>Можно ли вернуть или обменять товар?</summary>
              <p>
                Да — в соответствии с политикой возврата: в течение 14 дней при
                сохранённом товарном виде (подробнее у менеджера).
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary>Можно ли погасить рассрочку досрочно?</summary>
              <p>Да, досрочное погашение доступно без комиссий.</p>
            </details>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.hidden}`}
          aria-labelledby="final-title"
        >
          <div className={styles.cardContent}>
            <h3 id="final-title">Успейте получить подарок и скидку</h3>
            <p>
              Оставьте заявку сейчас — менеджер пришлёт каталог и расчёт
              платежей в удобный мессенджер.
            </p>
            <div className={styles.ctaRow}>
              <Button
                label="Узнать цену"
                color="orange"
                size="large"
                onClick={() => setIsQuizOpen(true)}
              />
              <button
                className={styles.ghost}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                На начало страницы
              </button>
            </div>
          </div>
        </section>
      </main>

      <div className={styles.bottomBtn} role="dialog" aria-hidden={!isQuizOpen}>
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
        successMessage="Заявка отправлена! Каталог уже у менеджера, мы свяжемся в течение 15 минут."
        title="TV_3"
      />
    </div>
  );
}
