'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';

export default function Phone3() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const router = useRouter();
  const handleQuizSubmit = async (data) => {
    axios
      .post(
        'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        data
      )
      .then(() => {
        router.push('/thank-you?source=phone3');
      });
  };
  const closeQuiz = () => {
    setIsQuizOpen(false);
  };
  const successMessage = (
    <div>{'Ваши данные успешно отправлены! Мы скоро свяжемся с вами'}</div>
  );
  const questions = [
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

  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <Image
            src="/images/xiaomi-13t-pro-model-3.png"
            alt="Phones Preview"
            width={600}
            height={400}
            className={styles.phonesImage}
          />
          <div className={styles.giftBadge}>
            PowerBank
            <br />
            или наушники
            <br />в подарок!
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.title}>
            КАКОЙ ТЕЛЕФОН ВАМ
            <br />
            ПОДХОДИТ И СКОЛЬКО ОН
            <br />
            СТОИТ?
          </h1>

          <p className={styles.offer}>
            Скидка 50% и Рассрочка без переплат - доступна каждому! Одобряем
            всем без справок и поручителей!
          </p>

          <p className={styles.description}>
            Ответьте всего на пару вопросов и получите точную стоимость со
            скидкой 50%
          </p>

          <div className={styles.ratingStars}>⬇️⬇️⬇️⬇️⬇️</div>

          <button
            className={styles.actionButton}
            onClick={() => setIsQuizOpen(true)}
          >
            Узнать стоимость →
          </button>

          <div className={styles.timerSection}>
            <p className={styles.timerLabel}>
              Спешите! До конца акции осталось:
            </p>
            <CountdownTimer className={styles.timer} />
          </div>
        </div>
        <Quiz
          isOpen={isQuizOpen}
          onClose={closeQuiz}
          questions={questions}
          onSubmit={handleQuizSubmit}
          successMessage={successMessage}
        />
      </div>
    </div>
  );
}
