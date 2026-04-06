import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Условия возврата — Texnobar',
  description:
    'Условия возврата товара в интернет-магазине Texnobar. Возврат в течение 14 дней при сохранении товарного вида и упаковки.',
  alternates: {
    canonical: `${siteUrl}/return`,
  },
};

export default function Return() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Условия возврата</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Порядок возврата</h2>
          <p>
            Вы можете вернуть товар в течение 14 дней с момента покупки при
            соблюдении следующих условий:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Товар не был в использовании</li>
            <li>Сохранены товарный вид и упаковка</li>
            <li>Имеются все документы о покупке</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
