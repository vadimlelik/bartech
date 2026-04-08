import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Сравнение товаров | Texnobar',
  description: 'Сравнение выбранных товаров по характеристикам в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompareLayout({ children }) {
  return children;
}
