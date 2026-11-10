import LaptopPageClient from './LaptopPageClient';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

const laptopTitle = 'Купить ноутбук в рассрочку в Минске — Технобар';
const laptopDescription =
  'Игровые и офисные ноутбуки в рассрочку в Минске. Оформление онлайн, доставка по Беларуси, без переплат по акциям. Технобар.';

export const metadata = mergeLandingMetadata('laptop', {
  title: { absolute: laptopTitle },
  description: laptopDescription,
  keywords: [
    'купить ноутбук в рассрочку минск',
    'ноутбук в рассрочку',
    'купить ноутбук в рассрочку',
    'ноутбук в рассрочку без переплат',
    'игровой ноутбук в рассрочку минск',
    'рассрочка на ноутбук минск',
  ],
  openGraph: {
    title: laptopTitle,
    description: laptopDescription,
    url: `${siteUrl}/laptop`,
    type: 'website',
    locale: 'ru_BY',
    siteName: 'Технобар',
  },
  alternates: {
    canonical: `${siteUrl}/laptop`,
  },
});

export default function LaptopPage() {
  return <LaptopPageClient />;
}
