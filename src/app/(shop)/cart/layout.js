import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Корзина | Texnobar',
  description: 'Товары в корзине интернет-магазина Texnobar.',
  alternates: {
    canonical: `${siteUrl}/cart`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }) {
  return children;
}
