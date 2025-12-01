'use client';

import React, { useState } from 'react';
import styles from './footer.module.css';
import Link from 'next/link';
import CreditCardsModal from '@/components/CreditCards/CreditCardsModal';

const Footer = () => {
  const [creditModalOpen, setCreditModalOpen] = useState(false);

  const handleCreditClick = (e) => {
    e.preventDefault();
    setCreditModalOpen(true);
  };

  return (
    <>
      <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.text}>
          ООО «Баратех» УНП: 193796252 <br /> Юридический и почтовый адрес:
          220068, г. Минск, ул. Червякова, д. 60, пом. 179
          <br /> +375 44 741-84-23
        </div>
        <div className={styles.content}>
          <div className={styles.offer}>
            <ul className={styles['footer__offer__list']}>
              <li className={styles['footer__offer__item']}>
                <span className={styles.bold}>Время работы - </span> с 9:00 до
                20:00 без выходных
              </li>
              <li className={styles['footer__offer__item']}>
                Доставка бесплатная по РБ от 500 руб. суммы заказа.
              </li>
              <li className={styles['footer__offer__item']}>
                <span className={styles.bold}>Сроки доставки:</span> по г
                .Минску 1-2 рабочих дня. По Беларуси (Кроме Минска) 3-5 рабочих
                дней.
              </li>
            </ul>
          </div>
          <div className={styles.offer}>
            <ul className={styles['footer__offer__list']}>
              <li className={styles['footer__offer__item']}>
                <span className={styles.bold}>Условия рассрочки</span> - Банки
                партнеры:
                <br /> ОАО &quot;Банк Дабрабыт&quot;
                <br /> ЗАО &quot;Сбербанк&quot;, <br />
                ОАО &quot;Паритетбанк&quot;
              </li>
              <li className={styles['footer__offer__item']}>
                Рассрочка предоставляеться на сроки 3 месяца, 6 месяцев, 12
                месяцев, 18 месяцев.{' '}
              </li>
              <li className={styles['footer__offer__item']}>
                <a
                  href="#"
                  onClick={handleCreditClick}
                  className={styles['footer__offer__link']}
                  style={{ cursor: 'pointer' }}
                >
                  Кредитные предложения
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.offer}>
            <ul>
              <li>
                <Link
                  className={styles['footer__offer__link']}
                  href={'pk'}
                  target="_blank"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  className={styles['footer__offer__link']}
                  href={'po'}
                >
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href={'guarantee'}
                  className={styles['footer__offer__link']}
                >
                  Возврат товара
                </Link>
              </li>
              <li>
                <Link
                  className={styles['footer__offer__link']}
                  href={'sales'}
                  target="_blank"
                >
                  Акции
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    <CreditCardsModal
      isOpen={creditModalOpen}
      onClose={() => setCreditModalOpen(false)}
    />
    </>
  );
};

export default Footer;
