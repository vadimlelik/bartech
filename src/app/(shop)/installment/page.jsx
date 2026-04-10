import { getInstallmentFaqSchema, SEO_INSTALLMENT_PHRASES } from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import styles from './page.module.css';

const title = 'Купить в рассрочку в Минске — условия Texnobar';
const description =
  'Купить в рассрочку телефоны, ноутбуки и технику в интернет-магазине Texnobar: до 12 месяцев, взнос от 10%, без переплат и скрытых комиссий. Оформление онлайн и в магазине.';

export const metadata = {
  title,
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
    siteName: 'Texnobar',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: `${siteUrl}/installment`,
  },
};

const faqItems = [
  {
    q: 'Как купить в рассрочку в Texnobar?',
    a: 'Выберите товар на сайте, нажмите «Купить», выберите способ оплаты «Рассрочка» и заполните онлайн-заявку. Менеджер свяжется с вами для подтверждения. Курьер привезёт товар и оформит все документы на месте.',
  },
  {
    q: 'На какой срок доступна рассрочка?',
    a: 'Рассрочка предоставляется на срок до 12 месяцев в зависимости от условий банка-партнёра и выбранного товара.',
  },
  {
    q: 'Есть ли переплаты при покупке в рассрочку?',
    a: 'В рамках действующих акций и партнёрских программ рассрочка предоставляется без переплат и скрытых комиссий.',
  },
  {
    q: 'Какой минимальный первоначальный взнос?',
    a: 'Минимальный первоначальный взнос составляет от 10% от стоимости товара. В рамках специальных акций возможна рассрочка без первоначального взноса.',
  },
  {
    q: 'Можно ли оформить рассрочку онлайн с доставкой по Минску?',
    a: 'Да. Заявку оформляете онлайн, курьер доставляет товар по Минску в день заказа или на следующий день и оформляет все документы на месте.',
  },
  {
    q: 'Нужна ли справка о доходах?',
    a: 'В большинстве случаев достаточно паспорта гражданина Республики Беларусь. Точные требования уточняйте у менеджера по телефону +375 (25) 776-64-62.',
  },
];

export default function Installment() {
  const faqSchema = getInstallmentFaqSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className={styles.container}>
        <h1 className={styles.h1}>
          Купить в рассрочку — телефоны и техника в Минске
        </h1>
        <p className={styles.lead}>
          В Texnobar можно купить в рассрочку смартфоны, ноутбуки, телевизоры и
          другую электронику на выгодных условиях: без переплат в рамках акций и
          партнёрских программ. Доставка по Минску и всей Беларуси.
        </p>

        <section className={styles.section}>
          <h2 className={styles.h2}>Условия рассрочки</h2>
          <ul className={styles.bulletList}>
            <li>Срок рассрочки: до 12 месяцев</li>
            <li>Первоначальный взнос: от 10% (в акциях — без взноса)</li>
            <li>Без переплат и скрытых комиссий</li>
            <li>Одобрение в течение 15–30 минут</li>
            <li>Достаточно паспорта гражданина Республики Беларусь</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Что можно купить в рассрочку</h2>
          <p className={styles.text}>
            В нашем каталоге доступны в рассрочку:
          </p>
          <ul className={styles.gridList}>
            <li>Смартфоны и телефоны</li>
            <li>Ноутбуки и планшеты</li>
            <li>Телевизоры Smart TV</li>
            <li>Персональные компьютеры</li>
            <li>Электросамокаты</li>
            <li>Велосипеды</li>
            <li>Мотоблоки и садовая техника</li>
            <li>Бытовая электроника</li>
          </ul>
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
                <span className={styles.stepText}>Заполните форму на сайте или позвоните нам: +375 (25) 776-64-62.</span>
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
                <span className={styles.stepText}>Курьер привезёт товар по Минску в день заказа, оформит все документы на месте.</span>
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

        <section className={styles.section}>
          <h2 className={styles.h2}>Часто задаваемые вопросы</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.h3}>{item.q}</h3>
                <p className={styles.text}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.contactCard}>
          <h2 className={styles.h3}>Остались вопросы?</h2>
          <p className={styles.text}>
            Позвоните нам или напишите на email — ответим на любые вопросы о рассрочке.
          </p>
          <p className={styles.contactRow}>
            Телефон:{' '}
            <a href="tel:+375257766462" className={styles.link}>
              +375 (25) 776-64-62
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
