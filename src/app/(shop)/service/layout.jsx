import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Сервисные центры | Texnobar',
  description:
    'Адреса и контакты сервисных центров Texnobar в Минске. Гарантийное и постгарантийное обслуживание техники.',
  alternates: {
    canonical: `${siteUrl}/service`,
  },
  openGraph: {
    title: 'Сервисные центры | Texnobar',
    description:
      'Адреса и контакты сервисных центров Texnobar в Минске.',
    url: `${siteUrl}/service`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Сервисные центры | Texnobar',
    description:
      'Адреса и контакты сервисных центров Texnobar в Минске.',
  },
};

export default function ServiceLayout({ children }) {
  return children;
}
