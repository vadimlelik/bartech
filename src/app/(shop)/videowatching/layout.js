import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Видеообзор товара | Texnobar',
  description: 'Просмотр видеообзора товаров в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/videowatching`,
  },
};

export default function VideoWatchingLayout({ children }) {
  return children;
}
