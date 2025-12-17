'use client';
import { useState, useEffect } from 'react';
import styles from './Phone4Theme.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import Quiz from '@/components/quiz/Quiz';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadTikTokPixel } from '@/shared/utils';

const defaultQuestions = [
  {
    id: 1,
    question: 'Выберите бренд телефона',
    type: 'checkbox',
    options: [
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Apple', label: 'Apple' },
      { value: 'Huawei', label: 'Huawei' },
      { value: 'Redmi', label: 'Redmi' },
      { value: 'Phone armor', label: 'Броне телефон' },
    ],
  },
  {
    id: 3,
    question: 'На какой ежемесячный платеж Вы рассчитываете?',
    type: 'radio',
    options: [
      { value: 'от 30 до 50 BYN/мес', label: 'от 30 до 50 BYN/мес' },
      { value: 'от 50 до 100 BYN/мес', label: 'от 50 до 100 BYN/мес' },
      { value: 'от 100 до 200 BYN/мес', label: 'от 100 до 200 BYN/мес' },
      { value: 'от 200 BYN/мес', label: 'от 200 BYN/мес' },
    ],
  },
  {
    id: 4,
    question: 'Введите ваш номер телефона',
    type: 'text',
  },
];

export default function Phone4Theme({ landingPage }) {
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

  const content = landingPage?.content || {};
  const images = landingPage?.images || [];
  const pixels = landingPage?.pixels || [];

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!pixels || pixels.length === 0) return;
    if (typeof window === 'undefined') return;

    const consent = localStorage.getItem('cookie-consent');
    if (consent !== 'accepted') return;

    const validPixels = pixels
      .filter((p) => p && typeof p === 'string' && p.trim() !== '')
      .map((p) => p.trim());
    if (validPixels.length === 0) return;

    if (!window.ttq) {
      loadTikTokPixel(validPixels[0]);
    }

    if (window.ttq) {
      validPixels.forEach((id) => window.ttq.load(id));
      window.ttq.page();
    }
  }, [pixels]);

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
        router.push(`/thank-you?source=${landingPage?.slug || 'landing'}`);
      });
  };

  const questions = content.questions || defaultQuestions;
  const benefits = Array.isArray(content.benefits) 
    ? content.benefits 
    : (content.benefits ? [content.benefits] : []);
  const advantages = Array.isArray(content.advantages) 
    ? content.advantages 
    : (content.advantages ? [content.advantages] : []);
  const reviews = Array.isArray(content.reviews) 
    ? content.reviews 
    : (content.reviews ? [content.reviews] : []);

  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          {content.heroTitle && (
            <h2 className={styles.heroTitle} dangerouslySetInnerHTML={{ __html: content.heroTitle }} />
          )}

          {benefits.length > 0 && (
            <ul className={styles.benefits}>
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          )}

          <div className={styles.timerBlock}>
            <p>До конца акции осталось:</p>
            <CountdownTimer />
          </div>

          {content.quizPrompt && (
            <p className={styles.quizPrompt}>{content.quizPrompt}</p>
          )}
          <div className={styles.actionButtonWrapper}>
            <button
              className={styles.actionButton}
              onClick={() => setIsQuizOpen(true)}
            >
              {content.buttonText || 'Узнать цену'}
            </button>
          </div>
        </div>

        {images.length > 0 && (
          <div className={styles.heroImage}>
            <Image
              src={images[0]}
              alt="Смартфоны"
              width={500}
              height={400}
              priority
            />
          </div>
        )}
      </div>

      {advantages.length > 0 && images.length > 1 && (
        <div className={styles.advantagesSection}>
          <div className={styles.advantagesImage}>
            <Image
              src={images[1]}
              alt="Смартфоны"
              width={500}
              height={400}
            />
          </div>

          <div className={styles.advantagesList}>
            {content.sectionTitle && (
              <h2 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: content.sectionTitle }} />
            )}

            {advantages.map((advantage, index) => (
              <div key={index} className={styles.advantageItem}>
                <span className={styles.advantageNumber}>{index + 1}</span>
                <div>
                  {typeof advantage === 'object' && advantage.title ? (
                    <>
                      <h3>{advantage.title}</h3>
                      <p>{advantage.description}</p>
                    </>
                  ) : (
                    <p>{advantage}</p>
                  )}
                </div>
              </div>
            ))}

            <div className={styles.actionButtonWrapper}>
              <button
                className={styles.actionButton}
                onClick={() => setIsQuizOpen(true)}
              >
                {content.buttonText || 'Узнать цену'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className={styles.reviewsSection}>
          {content.reviewsTitle && (
            <h2 className={styles.sectionTitle}>{content.reviewsTitle}</h2>
          )}
          {content.reviewsSubtitle && (
            <p className={styles.reviewsSubtitle}>{content.reviewsSubtitle}</p>
          )}

          <div className={styles.reviewsGrid}>
            {reviews.map((review, index) => {
              const reviewData = typeof review === 'object' ? review : { text: review, name: '', image: '' };
              return (
                <div key={index} className={styles.reviewCard}>
                  {reviewData.image && (
                    <div className={styles.reviewImageWrapper}>
                      <Image
                        src={reviewData.image}
                        alt={`Отзыв от ${reviewData.name}`}
                        width={300}
                        height={300}
                        className={styles.reviewImage}
                      />
                      <div className={styles.reviewImageOverlay} />
                    </div>
                  )}
                  <p className={styles.reviewText}>{reviewData.text}</p>
                  {reviewData.name && (
                    <p className={styles.reviewAuthor}>{reviewData.name}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className={styles.actionButton}
            onClick={() => setIsQuizOpen(true)}
          >
            {content.reviewsButtonText || 'Получить такой же телефон'}
          </button>
        </div>
      )}

      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title={landingPage?.title || 'Phone4'}
      />
    </div>
  );
}
