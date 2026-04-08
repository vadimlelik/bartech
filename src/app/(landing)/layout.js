import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import LandingClientLayout from './LandingClientLayout';

export const metadata = {
  title: 'Лендинги акций и рассрочки | Texnobar',
  description:
    'Акционные лендинги Texnobar: смартфоны, ноутбуки, телевизоры и техника в рассрочку без переплат.',
  openGraph: {
    title: 'Лендинги акций и рассрочки | Texnobar',
    description:
      'Акционные лендинги Texnobar: смартфоны, ноутбуки, телевизоры и техника в рассрочку.',
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Лендинги акций и рассрочки | Texnobar',
    description:
      'Акционные лендинги Texnobar: смартфоны, ноутбуки, телевизоры и техника в рассрочку.',
  },
};

export default function LandingLayout({ children }) {
  return <LandingClientLayout>{children}</LandingClientLayout>;
}
