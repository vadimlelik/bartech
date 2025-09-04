import TvPageClient from './TvPageClient';

export const metadata = {
  title: 'Телевизоры в рассрочку — TechnoBar',
  description:
    'Широкий выбор телевизоров Samsung, LG, Sony и других. Рассрочка без переплат до 24 месяцев. Онлайн заявка за 3 минуты.',
  openGraph: {
    title: 'Телевизоры в рассрочку',
    description:
      'Современные телевизоры в рассрочку до 24 месяцев без переплат',
  },
};

export default function Page() {
  return <TvPageClient />;
}
