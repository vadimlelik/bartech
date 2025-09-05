'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Loading from '@/app/loading';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Quiz from '@/components/quiz/Quiz';
import { PIXEL, PIXEL_2, PIXEL_3, PIXEL_4 } from '@/data/pixel';

export default function Laptop() {
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
        setIsLoading(false);
        router.push('/thank-you?source=laptop2');
      });
  };
  useEffect(() => {
    if (window.ttq) {
      window.ttq.load(PIXEL.laptop2);
      window.ttq.load(PIXEL_2.laptop2);
      window.ttq.load(PIXEL_3.laptop2);
      window.ttq.load(PIXEL_4.laptop2);

      window.ttq.page();
    }
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

  if (!now) return <Loading />;

  return (
    <div>
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
            🎁 <span>Подарок на выбор каждому покупателю</span>
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
