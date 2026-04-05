'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import CountdownTimer from '@/shared/ui/countdown-timer/CountdownTimer';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Loading from '@/app/loading';
import Quiz from '@/features/quiz/ui/Quiz';
import { PIXEL, PIXEL_2, PIXEL_3 } from '@/shared/config/pixel';
import { loadTikTokPixels } from '@/shared/utils';

export default function Phone5() {
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

  const [now, setNow] = useState(null);

  useEffect(() => {
    loadTikTokPixels([PIXEL.phone5, PIXEL_2.phone5, PIXEL_3.phone5]);
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
        router.push('https://technobar.by/thank-you?source=phone5');
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

  const questions = [
    {
      id: 4,
      question:
        'Оставьте заявку сейчас и получите Повербанк в подарок 🎁 🎁 🎁',
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
            Рассмотрение рассрочки от 15 минут
            <br />
            Смартфон популярных брендов от 29 руб/мес.
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

            {/* <h2 className={styles.productTitle}>Xiaomi Redmi 14C</h2> */}

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
                  src="/commentLogo-1.jpg"
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
        isLoading={isLoading}
        questions={questions}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title="Phone5"
      />
    </div>
  );
}
