import { getInstallmentFaqSchema, SEO_INSTALLMENT_PHRASES } from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

const title = 'Купить в рассрочку в Минске — условия Texnobar';
const description =
  'Купить в рассрочку телефоны, ноутбуки и технику в интернет-магазине Texnobar: до 12 месяцев, взнос от 10%, без переплат и скрытых комиссий. Оформление онлайн и в магазине.';

export const metadata = {
  title,
  description,
  keywords: [...SEO_INSTALLMENT_PHRASES, 'рассрочка минск', 'texnobar'],
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

export default function Installment() {
  const faqSchema = getInstallmentFaqSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Купить в рассрочку — телефоны и техника в Минске
        </h1>
        <p className="text-gray-700 mb-8 max-w-3xl">
          В Texnobar можно купить в рассрочку смартфоны, ноутбуки, телевизоры и
          другую электронику на выгодных условиях: без переплат в рамках акций и
          партнёрских программ.
        </p>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Условия рассрочки</h2>
            <p>
              Мы предлагаем возможность покупки товаров в рассрочку на
              следующих условиях:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Срок рассрочки: до 12 месяцев</li>
              <li>Первоначальный взнос: от 10%</li>
              <li>Без переплат и скрытых комиссий</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
