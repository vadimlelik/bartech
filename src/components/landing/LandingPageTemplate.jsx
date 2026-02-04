'use client';
import { useState, useEffect } from 'react';
import styles from '@/app/(landing)/[slug]/page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';
import { loadTikTokPixels } from '@/shared/utils';

// Фиксированные вопросы для квиза
const quizQuestions = [
  {
    id: 1,
    question: 'Выберите срок рассрочки для расчета платежей',
    type: 'radio',
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
    id: 3,
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
    id: 4,
    question:
      'Укажите на какой номер прислать каталог с ценами и графиками платежей',
    type: 'text',
  },
];

export default function LandingPageTemplate({ landing }) {
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

  // Загрузка пикселей TikTok
  useEffect(() => {
    if (
      landing?.pixels &&
      Array.isArray(landing.pixels) &&
      landing.pixels.length > 0
    ) {
      loadTikTokPixels(landing.pixels);
    }
  }, [landing]);

  // Применение кастомных цветов через CSS variables
  useEffect(() => {
    if (landing?.colors && typeof landing.colors === 'object') {
      const root = document.documentElement;
      Object.entries(landing.colors).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--color-${key}`, value);
        }
      });
    }
  }, [landing]);

  // Применяем фон за лендингом к body
  useEffect(() => {
    const bodyBackground = landing?.colors?.bodyBackground || '#ffffff';
    document.body.style.backgroundColor = bodyBackground;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [landing?.colors?.bodyBackground]);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(
        'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        {
          FIELDS: {
            ...data.FIELDS,
            UTM_SOURCE: utm_source || '',
            UTM_MEDIUM: utm_medium || '',
            UTM_CAMPAIGN: utm_campaign || '',
            UTM_CONTENT: utm_content || '',
            UTM_TERM: (ad || '') + (ttclid || ''),
          },
        }
      );
      setIsLoading(false);
      router.push(`https://technobar.by/thank-you?source=${landing.slug}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsLoading(false);
      alert(
        'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
      );
    }
  };

  if (!now) return <Loading />;

  const benefits = Array.isArray(landing.benefits) ? landing.benefits : [];
  const advantages = Array.isArray(landing.advantages)
    ? landing.advantages
    : [];
  const reviews = Array.isArray(landing.reviews) ? landing.reviews : [];
  const colors = landing.colors || {};
  const headerBg = colors.header || '#1a1a1a';
  const buttonBg = colors.button || '#4caf50';
  const buttonHover = colors.buttonHover || '#45a049';
  const backgroundColor = colors.background || '#ffffff';
  const textColor = colors.textColor || '#1a1a1a';

  return (
    <div
      className={styles.container}
      style={{ backgroundColor, color: textColor }}
    >
      <div className={styles.header} style={{ backgroundColor: headerBg }}>
        <h1 className={styles.mainTitle}>
          {landing.main_title || landing.title}
        </h1>

        <a
          href="tel:+375447883122"
          className={styles.priceButton}
          style={{
            backgroundColor: buttonBg,
            display: 'inline-block',
            marginTop: '10px',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonBg;
          }}
          rel="noreferrer"
        >
          {'Позвонить '}
        </a>
      </div>

      <div
        className={styles.mainSection}
        id="mainSection"
        data-animate="fade-in"
      >
        <div className={styles.textContent}>
          {benefits.length > 0 && (
            <ul className={styles.benefits}>
              {benefits.map((benefit, index) => (
                <li key={index} className={styles.checkmarkItem}>
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.timerSection}>
            <p>До конца акции осталось:</p>
            <CountdownTimer />
          </div>

          {landing.survey_text && (
            <p className={styles.surveyText}>{landing.survey_text}</p>
          )}

          <button
            className={styles.priceButton}
            onClick={() => setIsQuizOpen(true)}
            style={{
              backgroundColor: buttonBg,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = buttonHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonBg;
            }}
          >
            {landing.button_text || 'Узнать цену'}
          </button>
        </div>

        {landing.main_image && (
          <div className={styles.imageContainer}>
            <Image
              src={landing.main_image}
              alt={landing.title || 'Изображение'}
              width={500}
              height={400}
              priority
              className={styles.mainImage}
              style={{ width: '100%', height: 'auto' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            />
          </div>
        )}
      </div>

      {advantages.length > 0 && (
        <div
          className={styles.advantagesSection}
          id="advantagesSection"
          data-animate="slide-up"
        >
          {landing.secondary_image && (
            <div className={styles.advantagesImage}>
              <Image
                src={landing.secondary_image}
                alt="Особенности"
                width={500}
                height={400}
                className={styles.featuresImage}
                style={{ width: '100%', height: 'auto' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              />
            </div>
          )}

          <div className={styles.advantagesList}>
            <h2 className={styles.sectionTitle}>
              Преимущества нашего магазина
            </h2>

            {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`${styles.advantageItem} ${styles.fadeIn}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className={styles.advantageNumber}>{index + 1}</span>
                <div>
                  <h3>{advantage.title || advantage.name || ''}</h3>
                  <p>{advantage.description || advantage.desc || ''}</p>
                </div>
              </div>
            ))}

            <button
              className={styles.priceButton}
              onClick={() => setIsQuizOpen(true)}
              style={{
                backgroundColor: buttonBg,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = buttonHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = buttonBg;
              }}
            >
              {landing.button_text || 'Узнать цену'}
            </button>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div
          className={styles.reviewsSection}
          id="reviewsSection"
          data-animate="fade-in"
        >
          <h2 className={styles.reviewsTitle}>ОТЗЫВЫ НАШИХ ПОКУПАТЕЛЕЙ</h2>
          <div className={styles.reviewsGrid}>
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`${styles.reviewCard} ${styles.fadeIn}`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {review.image && (
                  <div
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      borderRadius: '10px',
                    }}
                  >
                    <Image
                      src={review.image}
                      alt="Отзыв покупателя"
                      width={300}
                      height={200}
                      className={styles.reviewImage}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                  </div>
                )}
                <p className={styles.reviewText}>
                  {review.text || review.comment || ''}
                </p>
              </div>
            ))}
          </div>
          <button
            className={styles.priceButton}
            onClick={() => setIsQuizOpen(true)}
            style={{
              backgroundColor: buttonBg,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = buttonHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = buttonBg;
            }}
          >
            {landing.button_text || 'Узнать цену'}
          </button>
        </div>
      )}

      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={quizQuestions}
        onSubmit={handleQuizSubmit}
        title={landing.title || 'Лендинг'}
      />
    </div>
  );
}
