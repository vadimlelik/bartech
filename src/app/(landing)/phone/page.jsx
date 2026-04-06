import PhonePageClient from './PhonePageClient';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Купить телефон в рассрочку в Минске — Texnobar',
  description:
    'Купить смартфон в рассрочку в Минске без переплат. Samsung, Apple, Xiaomi, Huawei — широкий выбор. Оформление онлайн, доставка по Минску в день заказа. Рассрочка до 12 месяцев.',
  keywords: [
    'купить телефон в рассрочку минск',
    'смартфон в рассрочку',
    'купить смартфон в рассрочку',
    'телефон в рассрочку без переплат',
    'купить iphone в рассрочку минск',
    'купить samsung в рассрочку минск',
    'рассрочка на телефон минск',
  ],
  openGraph: {
    title: 'Купить телефон в рассрочку в Минске — Texnobar',
    description:
      'Samsung, Apple, Xiaomi в рассрочку без переплат. Доставка по Минску в день заказа.',
    url: `${siteUrl}/phone`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/phone`,
  },
};

export default function PhonePage() {
  return <PhonePageClient />;
}
