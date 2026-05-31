import LaptopPageClient from './LaptopPageClient';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

export const metadata = mergeLandingMetadata('laptop', {
  title: 'Купить ноутбук в рассрочку в Минске — Texnobar',
  description:
    'Купить ноутбук в рассрочку в Минске без переплат. Широкий выбор: игровые, офисные, для учёбы. Рассрочка до 12 месяцев, доставка по Минску в день заказа. Оформление онлайн.',
  keywords: [
    'купить ноутбук в рассрочку минск',
    'ноутбук в рассрочку',
    'купить ноутбук в рассрочку',
    'ноутбук в рассрочку без переплат',
    'игровой ноутбук в рассрочку минск',
    'рассрочка на ноутбук минск',
  ],
  openGraph: {
    title: 'Купить ноутбук в рассрочку в Минске — Texnobar',
    description:
      'Ноутбуки в рассрочку без переплат. Игровые, офисные, для учёбы. Доставка по Минску.',
    url: `${siteUrl}/laptop`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/laptop`,
  },
});

export default function LaptopPage() {
  return <LaptopPageClient />;
}
