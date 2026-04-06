import { getInstallmentFaqSchema, SEO_INSTALLMENT_PHRASES } from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">
          Купить в рассрочку — телефоны и техника в Минске
        </h1>
        <p className="text-gray-700 mb-8 max-w-3xl text-lg">
          В Texnobar можно купить в рассрочку смартфоны, ноутбуки, телевизоры и
          другую электронику на выгодных условиях: без переплат в рамках акций и
          партнёрских программ. Доставка по Минску и всей Беларуси.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Условия рассрочки</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Срок рассрочки: до 12 месяцев</li>
            <li>Первоначальный взнос: от 10% (в акциях — без взноса)</li>
            <li>Без переплат и скрытых комиссий</li>
            <li>Одобрение в течение 15–30 минут</li>
            <li>Достаточно паспорта гражданина Республики Беларусь</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Что можно купить в рассрочку</h2>
          <p className="text-gray-700 mb-4">
            В нашем каталоге доступны в рассрочку:
          </p>
          <ul className="grid grid-cols-2 gap-2 list-disc ml-6 text-gray-700">
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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Как оформить рассрочку</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
              <div>
                <strong className="block mb-1">Выберите товар</strong>
                <span className="text-gray-600">Найдите нужный товар в каталоге и добавьте его в корзину.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
              <div>
                <strong className="block mb-1">Оформите заявку онлайн</strong>
                <span className="text-gray-600">Заполните форму на сайте или позвоните нам: +375 (25) 776-64-62.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
              <div>
                <strong className="block mb-1">Получите одобрение</strong>
                <span className="text-gray-600">Менеджер свяжется с вами в течение 15–30 минут и подтвердит условия.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</span>
              <div>
                <strong className="block mb-1">Получите товар с доставкой</strong>
                <span className="text-gray-600">Курьер привезёт товар по Минску в день заказа, оформит все документы на месте.</span>
              </div>
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Преимущества рассрочки в Texnobar</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Без переплат</strong> — платите ровно столько, сколько стоит товар</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Быстрое одобрение</strong> — решение за 15–30 минут</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Доставка по Минску</strong> в день заказа, по Беларуси за 1–3 дня</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Минимум документов</strong> — только паспорт гражданина РБ</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Оригинальные товары</strong> с гарантией производителя</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Часто задаваемые вопросы</h2>
          <div className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-gray-200 pb-5">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Остались вопросы?</h2>
          <p className="text-gray-700 mb-3">
            Позвоните нам или напишите на email — ответим на любые вопросы о рассрочке.
          </p>
          <p className="font-semibold">
            Телефон:{' '}
            <a href="tel:+375257766462" className="text-blue-600 hover:underline">
              +375 (25) 776-64-62
            </a>
          </p>
          <p className="font-semibold">
            Email:{' '}
            <a href="mailto:baratexby@gmail.com" className="text-blue-600 hover:underline">
              baratexby@gmail.com
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
