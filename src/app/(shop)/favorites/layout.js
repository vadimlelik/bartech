import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Избранное | Texnobar',
  description: 'Список избранных товаров пользователя в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/favorites`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({ children }) {
  return children;
}
