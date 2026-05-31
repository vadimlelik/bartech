import TvPageClient from './TvPageClient';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { mergeLandingMetadata } from '@/shared/lib/landing-seo';

export const metadata = mergeLandingMetadata('tv3', {
  title: 'Телевизоры в рассрочку — TechnoBar',
  description:
    'Широкий выбор телевизоров Samsung, LG, Sony и других. Рассрочка без переплат до 24 месяцев. Онлайн заявка за 3 минуты.',
  openGraph: {
    title: 'Телевизоры в рассрочку',
    description:
      'Современные телевизоры в рассрочку до 24 месяцев без переплат',
    url: `${siteUrl}/tv3`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Телевизоры в рассрочку — TechnoBar',
    description:
      'Широкий выбор телевизоров Samsung, LG, Sony и других. Рассрочка без переплат до 24 месяцев.',
  },
});

export default function Page() {
  return <TvPageClient />;
}
