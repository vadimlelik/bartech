import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

const tvTitle = 'Smart TV в рассрочку в Минске — купить в Технобар';
const tvDescription =
  'Телевизоры Samsung, LG и другие бренды в рассрочку в Минске. До 12 месяцев, без переплат по акциям, доставка по Беларуси.';

export const metadata = mergeLandingMetadata('tv1', {
  title: { absolute: tvTitle },
  description: tvDescription,
  openGraph: {
    title: tvTitle,
    description: tvDescription,
    url: `${siteUrl}/tv1`,
    locale: 'ru_BY',
    siteName: 'Технобар',
  },
  alternates: { canonical: `${siteUrl}/tv1` },
});

export default function Layout({ children }) {
  return children;
}
