import ReviewsContent from './ReviewsContent';
import { getAggregateRatingSchema } from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Отзывы клиентов — Texnobar | Покупки в рассрочку в Минске',
  description:
    'Отзывы покупателей интернет-магазина Texnobar. Клиенты о покупке телефонов, ноутбуков и техники в рассрочку в Минске. Рейтинг 4.8 из 5 на основе реальных отзывов.',
  alternates: {
    canonical: `${siteUrl}/reviews`,
  },
  openGraph: {
    title: 'Отзывы клиентов — Texnobar',
    description:
      'Реальные отзывы покупателей о покупке техники в рассрочку в Texnobar. Рейтинг 4.8/5.',
    url: `${siteUrl}/reviews`,
    type: 'website',
  },
};

export default function Reviews() {
  const aggregateRatingSchema = getAggregateRatingSchema('4.8', '10');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <ReviewsContent />
    </>
  );
}
