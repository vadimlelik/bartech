import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

export const metadata = mergeLandingMetadata('tv1', {
  title: 'Купить телевизор в рассрочку в Минске — Texnobar',
  description:
    'Телевизоры Samsung, LG, Sony и другие бренды в рассрочку без переплат. Доставка по Минску и Беларуси.',
  alternates: { canonical: `${siteUrl}/tv1` },
});

export default function Layout({ children }) {
  return children;
}
