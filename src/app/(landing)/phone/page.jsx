import PhonePageClient from './PhonePageClient';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

const phoneTitle = 'Телефоны в рассрочку в Минске — купить в Технобар';
const phoneDescription =
  'Телефоны и смартфоны в рассрочку в Минске: Samsung, Apple, Xiaomi. До 12 месяцев, без переплат по акциям. Технобар.';

export const metadata = mergeLandingMetadata('phone', {
  title: { absolute: phoneTitle },
  description: phoneDescription,
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
    title: phoneTitle,
    description: phoneDescription,
    url: `${siteUrl}/phone`,
    type: 'website',
    locale: 'ru_BY',
    siteName: 'Технобар',
  },
  alternates: {
    canonical: `${siteUrl}/phone`,
  },
});

export default function PhonePage() {
  return <PhonePageClient />;
}
