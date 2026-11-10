'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreditCardsModal from '@/features/credit-cards/ui/CreditCardsModal';
import styles from './footer.module.css';

const DOCUMENTS = [
  { href: 'https://technobar.by/pk', label: 'Политика конфиденциальности' },
  { href: 'https://technobar.by/po', label: 'Публичная оферта' },
  { href: 'https://technobar.by/guarantee', label: 'Возврат товара' },
  { href: 'https://technobar.by/sales', label: 'Акции' },
  {
    href: 'https://drive.google.com/drive/folders/1FGlmNEqbBpMffkOpQqsT53d5G3cAMhU5',
    label: 'Сертификаты',
  },
];

const BANKS = [
  'ОАО «Банк Дабрабыт»',
  'ЗАО «Сбер Банк»',
  'ОАО «Паритетбанк»',
  'ОАО «АСБ Беларусбанк»',
];

const Footer = () => {
  const [creditModalOpen, setCreditModalOpen] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.brand}>
            <p className={styles.companyTitle}>ООО «Баратех»</p>
            <p className={styles.muted}>УНП: 193796252</p>
            <p className={styles.muted}>
              Юридический и почтовый адрес: 220013, г. Минск, ул. Сурганова, д. 43, пом. 804
            </p>
            <a className={styles.phone} href="tel:+375447418423">
              +375 44 741-84-23
            </a>
          </div>
          <div className={styles.columns}>
            <section>
              <h2 className={styles.columnTitle}>Доставка</h2>
              <ul>
                <li>Ежедневно с 9:00 до 20:00, без выходных</li>
                <li>Бесплатно по Беларуси от 500 руб. суммы заказа</li>
                <li>Минск — 1–2 рабочих дня. По стране, кроме Минска, — 3–5 рабочих дней</li>
              </ul>
            </section>
            <section>
              <h2 className={styles.columnTitle}>Рассрочка</h2>
              <p className={styles.note}>Сроки: 3, 6, 12 и 18 месяцев.</p>
              <ul className={styles.banks}>
                {BANKS.map((bank) => (
                  <li key={bank}>{bank}</li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.creditButton}
                onClick={() => setCreditModalOpen(true)}
              >
                Кредитные предложения
              </button>
            </section>
            <nav aria-label="Документы">
              <h2 className={styles.columnTitle}>Документы</h2>
              <ul className={styles.links}>
                {DOCUMENTS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
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
