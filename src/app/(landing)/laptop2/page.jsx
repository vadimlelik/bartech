'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/features/quiz/ui/Quiz';
import {
  PIXEL,
  PIXEL_2,
  PIXEL_3,
  PIXEL_4,
  PIXEL_5,
  PIXEL_6,
} from '@/shared/config/pixel';
import { loadTikTokPixels } from '@/shared/utils';
import Script from 'next/script';

export default function Laptop() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  useEffect(() => {
  }, []);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/quiz', {
        FIELDS: {
          ...data.FIELDS,
          UTM_SOURCE: utm_source || '',
          UTM_MEDIUM: utm_medium || '',
          UTM_CAMPAIGN: utm_campaign || '',
          UTM_CONTENT: utm_content || '',
          UTM_TERM: (ad || '') + (ttclid || ''),
        },
      });

      if (response.data?.success) {
        router.push('https://technobar.by/thank-you?source=laptop2');
      } else {
        alert('Форма отправлена слишком часто. Попробуйте через минуту.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      if (error.response?.status === 429) {
        alert('Форма уже отправлена. Попробуйте через минуту.');
      } else {
        alert(
          'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadTikTokPixels([
      PIXEL.laptop2,
      PIXEL_2.laptop2,
      PIXEL_3.laptop2,
      PIXEL_4.laptop2,
      PIXEL_5.laptop2,
      PIXEL_6.laptop2,
    ]);
  }, []);

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
        { value: 'Мышка с сумкой', label: 'Мышка с сумкой 🖱' },
        { value: 'Телефон', label: 'Телефон 📱' },
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
          fbq('init', '1432096711197233');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1432096711197233&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      <section className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <p className={styles.subtitle}>
            ДАРИМ СКИДКУ ДО -30% НА ВСЕ НОУТБУКИ К НОВОМУ УЧЕБНОМУ ГОДУ
          </p>
          <h1 className={styles.title}>
            <span>НОУТБУКИ</span> ВСЕХ МОДЕЛЕЙ В НАЛИЧИИ
          </h1>
          <ul className={styles.list}>
            <li>
              Оплата частями <span>от 35р/мес</span>
            </li>
            <li>
              Первый взнос <span>0 рублей</span>
            </li>
            <li>Модели на любой вкус и бюджет</li>
            <li>
              Подбор модели и доставка – <span>бесплатно!</span>
            </li>
            <li>
              <span>Более 1000</span> довольных клиентов!
            </li>
          </ul>
          <div className={styles.bottomBtn}>
            <button onClick={() => setIsQuizOpen(true)} className={styles.btn}>
              <span>Подобрать ноутбук</span>
            </button>
          </div>
          <div className={styles.gift}>
            🎁{' '}
            <span>Подарок на выбор смартфон или Яндекс станция с Алисой</span>
          </div>
        </div>
      </section>
      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="laptop"
      />
    </div>
  );
}
