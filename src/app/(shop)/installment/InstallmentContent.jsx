'use client';

import { useCity } from '@/entities/city';
import { SeoCitabilityPanel, SeoFaqSection, PriorityCategoryLinks } from '@/shared/ui/seo';
import { buildInstallmentCityCopy } from '@/shared/lib/installment-copy';
import InfoNav from '@/shared/ui/info-nav/InfoNav';
import styles from './page.module.css';

export default function InstallmentContent() {
  const { commerceCity, pageCity } = useCity();
  const city = commerceCity || pageCity;
  const copy = buildInstallmentCityCopy(city);
  const bullets = city?.installmentTerms?.bullets || [];

  return (
    <div className={styles.container}>
      <InfoNav />
      <h1 className={styles.h1}>{copy.h1}</h1>
      <p className={styles.lead}>{copy.lead}</p>

      <SeoCitabilityPanel
        question={copy.question}
        answer={copy.answer}
        defaultExpanded
        label="Как это работает"
      />

      <section className={styles.section}>
        <h2 className={styles.h2}>Условия рассрочки</h2>
        <ul className={styles.bulletList}>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Что можно купить в рассрочку</h2>
        <p className={styles.text}>В нашем каталоге доступны в рассрочку:</p>
        <PriorityCategoryLinks listClassName={styles.gridList} linkClassName={styles.link} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Как оформить рассрочку</h2>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepBadge}>1</span>
            <div>
              <strong className={styles.stepTitle}>Выберите товар</strong>
              <span className={styles.stepText}>Найдите нужный товар в каталоге и добавьте его в корзину.</span>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepBadge}>2</span>
            <div>
              <strong className={styles.stepTitle}>Оформите заявку онлайн</strong>
              <span className={styles.stepText}>
                Заполните форму на сайте или позвоните нам: {copy.phoneDisplay}.
              </span>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepBadge}>3</span>
            <div>
              <strong className={styles.stepTitle}>Получите одобрение</strong>
              <span className={styles.stepText}>
                Менеджер свяжется с вами в течение 15–30 минут и подтвердит условия.
              </span>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepBadge}>4</span>
            <div>
              <strong className={styles.stepTitle}>Получите товар с доставкой</strong>
              <span className={styles.stepText}>{copy.stepDelivery}</span>
            </div>
          </li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Преимущества рассрочки в Texnobar</h2>
        <ul className={styles.advantages}>
          <li className={styles.advantageItem}>
            <span className={styles.check}>✓</span>
            <span>
              <strong>Без переплат</strong> — платите ровно столько, сколько стоит товар
            </span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.check}>✓</span>
            <span>
              <strong>Быстрое одобрение</strong> — решение за 15–30 минут
            </span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.check}>✓</span>
            <span>
              <strong>{copy.deliveryTitle}</strong> в день заказа, по Беларуси за 1–3 дня
            </span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.check}>✓</span>
            <span>
              <strong>Минимум документов</strong> — только паспорт гражданина РБ
            </span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.check}>✓</span>
            <span>
              <strong>Оригинальные товары</strong> с гарантией производителя
            </span>
          </li>
        </ul>
      </section>

      <div className={styles.faqWrapper}>
        <SeoFaqSection title="Часто задаваемые вопросы" items={copy.faq} />
      </div>

      <section className={styles.contactCard}>
        <h2 className={styles.h3}>Остались вопросы?</h2>
        <p className={styles.text}>
          Позвоните нам или напишите на email — ответим на любые вопросы о рассрочке.
        </p>
        <p className={styles.contactRow}>
          Телефон:{' '}
          <a href={`tel:${copy.phoneTel}`} className={styles.link}>
            {copy.phoneDisplay}
          </a>
        </p>
        <p className={styles.contactRow}>
          Email:{' '}
          <a href={`mailto:${copy.email}`} className={styles.link}>
            {copy.email}
          </a>
        </p>
      </section>
    </div>
  );
}
