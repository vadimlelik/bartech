import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

const motoblokTitle = 'Купить мотоблок в рассрочку в Минске — Технобар';
const motoblokDescription =
  'Мотоблоки МТЗ в рассрочку в Минске и по Беларуси. До 12 месяцев, без переплат по акциям. Технобар.';

export const metadata = mergeLandingMetadata('motoblok', {
  title: { absolute: motoblokTitle },
  description: motoblokDescription,
  openGraph: {
    title: motoblokTitle,
    description: motoblokDescription,
    url: `${siteUrl}/motoblok`,
    locale: 'ru_BY',
    siteName: 'Технобар',
  },
  alternates: { canonical: `${siteUrl}/motoblok` },
});

export default function Layout({ children }) {
  return children;
}
