import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

export const metadata = mergeLandingMetadata('phone7', {
  title: 'Смартфоны в рассрочку до 5 лет | Technobar',
  description:
    'Новый смартфон в рассрочку до 5 лет без справок о доходах и первого взноса. Более 1000 моделей в наличии, второй телефон в подарок и бесплатная доставка по Беларуси.',
  openGraph: {
    title: 'Смартфоны в рассрочку до 5 лет | Technobar',
    description:
      'Новый смартфон в рассрочку до 5 лет без справок о доходах и первого взноса. Более 1000 моделей в наличии, второй телефон в подарок и бесплатная доставка по Беларуси.',
    url: `${siteUrl}/phone7`,
    siteName: 'Technobar',
    images: [
      {
        url: '/images/mobile/mobile_1.jpeg',
        width: 1200,
        height: 630,
        alt: 'Смартфоны в рассрочку в Technobar',
      },
    ],
    locale: 'ru_BY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Смартфоны в рассрочку до 5 лет | Technobar',
    description:
      'Новый смартфон в рассрочку до 5 лет без справок о доходах и первого взноса. Более 1000 моделей в наличии, второй телефон в подарок и бесплатная доставка по Беларуси.',
    images: ['/images/mobile/mobile_1.jpeg'],
  },
});

export default function Phone7Layout({ children }) {
  return children;
}
