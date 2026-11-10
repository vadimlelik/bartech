import {
  getInstallmentFaqSchema,
  SEO_INSTALLMENT_PHRASES,
  INSTALLMENT_FAQ_ITEMS,
  INSTALLMENT_CITABILITY_QUESTION,
  INSTALLMENT_CITABILITY_ANSWER,
  buildDefaultOpenGraphImages,
} from '@/shared/lib/seo';
import { SeoCitabilityPanel, SeoFaqSection, JsonLd, PriorityCategoryLinks } from '@/shared/ui/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getPageCity } from '@/entities/city/model/cities';
import styles from './page.module.css';
import InfoNav from '@/shared/ui/info-nav/InfoNav';

const title = 'Рассрочка без переплат в Минске — Технобар';
const description =
  'Рассрочка на технику в Минске и по Беларуси: до 12 месяцев, взнос от 10%, без переплат по акциям. Технобар.';

export const metadata = {
  title: { absolute: title },
  description,
  keywords: [
    ...SEO_INSTALLMENT_PHRASES,
    'рассрочка минск',
    'купить смартфон в рассрочку минск',
    'купить ноутбук в рассрочку минск',
    'купить телевизор в рассрочку минск',
    'рассрочка без справки минск',
    'texnobar',
  ],
  openGraph: {
    title,
    description,
    type: 'article',
    url: `${siteUrl}/installment`,
    siteName: 'Технобар',
    locale: 'ru_BY',
    images: buildDefaultOpenGraphImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/installment`,
  },
};

export default async function Installment() {
  const city = await getPageCity();
  const bullets = city?.installmentTerms?.bullets || [];
  const faqSchema = getInstallmentFaqSchema();

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className={styles.container}>
        <InfoNav />
        <h1 className={styles.h1}>
          Купить в рассрочку — телефоны и техника в {city?.nameIn || 'Минске'}
        </h1>
        <p className={styles.lead}>
          В Texnobar можно купить в рассрочку смартфоны, ноутбуки, телевизоры и
          другую электронику на выгодных условиях: без переплат в рамках акций и
          партнёрских программ. Доставка по Минску и всей Беларуси.
        </p>

        <SeoCitabilityPanel
          question={INSTALLMENT_CITABILITY_QUESTION}
          answer={INSTALLMENT_CITABILITY_ANSWER}
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
          <p className={styles.text}>
            В нашем каталоге доступны в рассрочку:
          </p>
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
                <span className={styles.stepText}>Заполните форму на сайте или позвоните нам: {city?.phoneDisplay || '+375 44 741-84-23'}.</span>
              </div>
            </li>
            <li className={styles.step}>
              <span className={styles.stepBadge}>3</span>
              <div>
                <strong className={styles.stepTitle}>Получите одобрение</strong>
                <span className={styles.stepText}>Менеджер свяжется с вами в течение 15–30 минут и подтвердит условия.</span>
              </div>
            </li>
            <li className={styles.step}>
              <span className={styles.stepBadge}>4</span>
              <div>
                <strong className={styles.stepTitle}>Получите товар с доставкой</strong>
                <span className={styles.stepText}>
                  Курьер привезёт товар по {city?.nameIn || 'Минску'} по условиям доставки города.
                </span>
              </div>
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Преимущества рассрочки в Texnobar</h2>
          <ul className={styles.advantages}>
            <li className={styles.advantageItem}>
              <span className={styles.check}>✓</span>
              <span><strong>Без переплат</strong> — платите ровно столько, сколько стоит товар</span>
            </li>
            <li className={styles.advantageItem}>
              <span className={styles.check}>✓</span>
              <span><strong>Быстрое одобрение</strong> — решение за 15–30 минут</span>
            </li>
            <li className={styles.advantageItem}>
              <span className={styles.check}>✓</span>
              <span><strong>Доставка по Минску</strong> в день заказа, по Беларуси за 1–3 дня</span>
            </li>
            <li className={styles.advantageItem}>
              <span className={styles.check}>✓</span>
              <span><strong>Минимум документов</strong> — только паспорт гражданина РБ</span>
            </li>
            <li className={styles.advantageItem}>
              <span className={styles.check}>✓</span>
              <span><strong>Оригинальные товары</strong> с гарантией производителя</span>
            </li>
          </ul>
        </section>

        <div className={styles.faqWrapper}>
          <SeoFaqSection
            title="Часто задаваемые вопросы"
            items={INSTALLMENT_FAQ_ITEMS}
          />
        </div>

        <section className={styles.contactCard}>
          <h2 className={styles.h3}>Остались вопросы?</h2>
          <p className={styles.text}>
            Позвоните нам или напишите на email — ответим на любые вопросы о рассрочке.
          </p>
          <p className={styles.contactRow}>
            Телефон:{' '}
            <a href={`tel:${city?.phoneTel || '+375447418423'}`} className={styles.link}>
              {city?.phoneDisplay || '+375 44 741-84-23'}
            </a>
          </p>
          <p className={styles.contactRow}>
            Email:{' '}
            <a href="mailto:baratexby@gmail.com" className={styles.link}>
              baratexby@gmail.com
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
