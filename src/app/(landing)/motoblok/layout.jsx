import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

export const metadata = mergeLandingMetadata('motoblok', {
  title: 'Мотоблоки МТЗ в рассрочку — Texnobar',
  description:
    'Купить мотоблок МТЗ в рассрочку без переплат. Доставка по Беларуси, сезонные акции.',
  alternates: { canonical: `${siteUrl}/motoblok` },
});

export default function Layout({ children }) {
  return children;
}
