'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '@/app/loading';
import Quiz from '@/components/quiz/Quiz';

export default function Phone5() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const router = useRouter();

  const [now, setNow] = useState(null);

  const handleQuizSubmit = async (data) => {
    axios
      .post(
        'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        data
      )
      .then(() => {
        router.push('/thank-you?source=phone');
      });
  };

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
      id: 2,
      question: 'Работаете ли Вы на последнем рабочем месте более 3-х месяцев?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' },
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
  useEffect(() => {
    setNow(Date.now());
  }, []);

  if (!now) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.marquee}>
        <div className={styles.marqueeContent}>
          Самое выгодное предложение - 50% Скидка ❗ Самое выгодное предложение
          - 50% Скидка ❗ Самое выгодное предложение - 50% Скидка ❗ Самое
          выгодное предложение - 50% Скидка ❗
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>
            Одобряем рассрочку всем.
            <br />
            Смартфон Xiaomi от 29 руб/мес.
          </h1>
        </div>

        <div className={styles.productCard}>
          <div className={styles.productInfo}>
            <div className={styles.installmentLabel}>
              <Image
                src="/percent.jpeg"
                alt="Рассрочка"
                width={20}
                height={20}
              />
              Рассрочка под 0%
            </div>

            <h2 className={styles.productTitle}>Xiaomi Redmi 14C</h2>

            <div className={styles.priceBlock}>
              <div className={styles.price}>
                От 29 руб/мес
                <span className={styles.oldPrice}>55 руб/мес(-50%🔥)</span>
              </div>
              <div className={styles.rating}>
                {'★'.repeat(5)}
                <span className={styles.inStock}>В наличии</span>
              </div>
            </div>

            <p className={styles.colorOption}>Цвет: любой по запросу</p>

            <div className={styles.timerSection}>
              <p>Спешите! Акция заканчивается через</p>
              <CountdownTimer />
            </div>

            <button
              className={styles.actionButton}
              onClick={() => setIsQuizOpen(true)}
            >
              Узнать цену →
            </button>
          </div>

          <div className={styles.productImage}>
            <Image
              src="/Xiaomi-Redmi-14C.jpg"
              alt="Xiaomi Redmi 14C"
              width={600}
              height={600}
              className={styles.phoneImage}
            />
          </div>
        </div>

        <div className={styles.advantages}>
          <div className={styles.advantageItem}>
            <Image src="/check.png" alt="Одобрим всем" width={40} height={40} />
            <div className={styles.advantageContent}>
              <h3>Одобрим всем!</h3>
              <p>Рассрочка до 5 лет за 5 минут!</p>
            </div>
          </div>

          <div className={styles.advantageItem}>
            <Image src="/doc.png" alt="Простота" width={40} height={40} />
            <div className={styles.advantageContent}>
              <h3>Простота!</h3>
              <p>Без справок о доходах и лишних документов</p>
            </div>
          </div>

          <div className={styles.advantageItem}>
            <Image src="/zero.png" alt="0%" width={40} height={40} />
            <div className={styles.advantageContent}>
              <h3>0%</h3>
              <p>Рассрочка без первого взноса</p>
            </div>
          </div>

          <div className={styles.advantageItem}>
            <Image src="/delivery.png" alt="Доставка" width={40} height={40} />
            <div className={styles.advantageContent}>
              <h3>Не выходя из дома!</h3>
              <p>Бесплатная доставка в любую точку Беларуси за 1-3 дня</p>
            </div>
          </div>

          <div className={styles.advantageItem}>
            <Image src="/warranty.png" alt="Гарантия" width={40} height={40} />
            <div className={styles.advantageContent}>
              <h3>Официальная гарантия</h3>
              <p>2 года от производителя</p>
            </div>
          </div>
        </div>

        <div className={styles.reviewsSection}>
          <h2>Отзывы наших клиентов</h2>
          <div className={styles.reviewStats}>
            <div className={styles.rating}>
              <span className={styles.ratingNumber}>4.98</span> из 5
              <div className={styles.stars}>{'★'.repeat(5)}</div>
              <p>На основе 295 отзывов</p>
            </div>
            <div className={styles.ratingBars}>
              <div className={styles.ratingBar}>
                <span>{'★'.repeat(5)}</span>
                <div className={styles.barFull}></div>
                <span>332</span>
              </div>
              <div className={styles.ratingBar}>
                <span>{'★'.repeat(4)}</span>
                <div className={styles.barPartial}></div>
                <span>3</span>
              </div>
              <div className={styles.ratingBar}>
                <span>{'★'.repeat(3)}</span>
                <div className={styles.barEmpty}></div>
                <span>0</span>
              </div>
              <div className={styles.ratingBar}>
                <span>{'★'.repeat(2)}</span>
                <div className={styles.barEmpty}></div>
                <span>0</span>
              </div>
              <div className={styles.ratingBar}>
                <span>{'★'.repeat(1)}</span>
                <div className={styles.barEmpty}></div>
                <span>0</span>
              </div>
            </div>
          </div>

          <div className={styles.reviews}>
            <div className={styles.review}>
              <div className={styles.reviewHeader}>
                <Image
                  src="/commentLogo-4.jpg"
                  alt="Евгений"
                  width={50}
                  height={50}
                  className={styles.reviewerImage}
                />
                <div>
                  <h3>Евгений</h3>
                  <div className={styles.stars}>{'★'.repeat(5)}</div>
                </div>
              </div>
              <p>
                Купил Xiaomi Redmi 14C для себя. Все прошло отлично, как и
                договаривались с менеджером. Доставили в Гродно через 3 дня и
                бесплатно. Очень доволен покупкой!
              </p>
            </div>

            <div className={styles.review}>
              <div className={styles.reviewHeader}>
                <Image
                  src="/commentLogo-2.jpg"
                  alt="Михаил"
                  width={50}
                  height={50}
                  className={styles.reviewerImage}
                />
                <div>
                  <h3>Михаил</h3>
                  <div className={styles.stars}>{'★'.repeat(5)}</div>
                </div>
              </div>
              <p>
                Спасибо огромное за Xiaomi Redmi 14C! Искал именно эту модель по
                адекватной цене и случайно нашел ваш магазин в TikTok. Отдельная
                благодарность за быструю доставку
              </p>
            </div>

            <div className={styles.review}>
              <div className={styles.reviewHeader}>
                <Image
                  src="/commentLogo-3.jpg"
                  alt="Анна"
                  width={50}
                  height={50}
                  className={styles.reviewerImage}
                />
                <div>
                  <h3>Анна</h3>
                  <div className={styles.stars}>{'★'.repeat(5)}</div>
                </div>
              </div>
              <p>
                Телефон просто супер, сервис магазина на высоте,
                проконсультировали по моделям и подобрали оптимальные условия
                оплаты. Ещё и доставили за бесплатно в мой город.
              </p>
            </div>
          </div>

          <button
            className={styles.actionButton}
            onClick={() => setIsQuizOpen(true)}
          >
            Узнать цену →
          </button>
        </div>
      </main>

      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
      />
    </div>
  );
}
