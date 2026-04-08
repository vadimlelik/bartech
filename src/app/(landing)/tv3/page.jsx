import TvPageClient from './TvPageClient';

export const metadata = {
  title: 'Телевизоры в рассрочку — TechnoBar',
  description:
    'Широкий выбор телевизоров Samsung, LG, Sony и других. Рассрочка без переплат до 24 месяцев. Онлайн заявка за 3 минуты.',
  alternates: {
    canonical: '/tv3',
  },
  openGraph: {
    title: 'Телевизоры в рассрочку',
    description:
      'Современные телевизоры в рассрочку до 24 месяцев без переплат',
    url: '/tv3',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Телевизоры в рассрочку — TechnoBar',
    description:
      'Широкий выбор телевизоров Samsung, LG, Sony и других. Рассрочка без переплат до 24 месяцев.',
  },
};

export default function Page() {
  return <TvPageClient />;
}
