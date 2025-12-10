'use client';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Marquee from '@/app/(shop)/components/Marquee/Marquee';
import styles from './discountPage.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { PIXEL, PIXEL_2, PIXEL_3 } from '@/data/pixel';
import { loadTikTokPixels } from '@/shared/utils';
import Loading from '@/app/loading';
import Button from '@/app/(shop)/components/button/Button';
import Quiz from '@/components/quiz/Quiz';

const questions = [
  {
    id: 1,
    question: 'Выберите бренд телефона',
    type: 'radio',
    options: [
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Apple', label: 'Apple' },
      {
        value: 'Huawei',
        label: 'Huawei',
      },
      { value: 'Redmi', label: 'Redmi' },
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

export default function DiscountPage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [now, setNow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');
  const router = useRouter();

  useEffect(() => {
    loadTikTokPixels([PIXEL.discount50, PIXEL_3.discount50]);
  }, []);

  const closeQuiz = () => {
    setIsQuizOpen(false);
  };

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
        closeQuiz();
        setIsLoading(false);
        router.push('/thank-you?source=discount50');
      });
  };

  const successMessage = (
    <div>{'Ваши данные успешно отправлены! Мы скоро свяжемся с вами'}</div>
  );

  useEffect(() => {
    setNow(Date.now());
  }, []);
  if (!now) return <Loading />;

  return (
    <div className={styles.page}>
      <Marquee />
      <div className={styles.content}>
        <h1 className={styles.title}>
          НОВЫЕ СМАРТФОНЫ
          <br />
          <span>СО СКИДКОЙ ДО 50%</span>
        </h1>
        <h3 className={styles.subtitle}>ДО КОНЦА РАСПРОДАЖИ ОСТАЛОСЬ:</h3>
        <CountdownTimer className={styles.discountTimer} />
        <h5 className={styles.description}>НАУШНИКИ В ПОДАРОК!</h5>
        <Button
          label="Оформить заказ"
          color="dangery"
          size="small"
          onClick={() => setIsQuizOpen(true)}
        />
      </div>
      <Marquee color="red" colorText="white" />
      <div className={styles.info}>
        <ul className={styles.infoList}>
          <li className={styles.InfoItem}>
            БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕЙ БЕЛАРУСИ
          </li>
          <li className={styles.InfoItem}>БЕЗ ПЕРВОГО ВЗНОСА И ПЕРЕПЛАТ</li>
          <li className={styles.InfoItem}>РАССРОЧКУ ОТ 6 МЕСЯЦЕВ</li>
          <li className={styles.InfoItem}>
            БЕЗ ПОРУЧИТЕЛЕЙ И СПРАВОК О ДОХОДАХ
          </li>
          <li className={styles.InfoItem}>ДАРИМ НАУШНИКИ К КАЖДОМУ ЗАКАЗУ</li>
        </ul>
      </div>
      <Marquee color="yellow" colorText="black" />
      <Quiz
        isOpen={isQuizOpen}
        onClose={closeQuiz}
        questions={questions}
        isLoading={isLoading}
        onSubmit={handleQuizSubmit}
        successMessage={successMessage}
        title="discount50"
      />
    </div>
  );
}
