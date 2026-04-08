import ComparePanel from '@/widgets/compare/ui/ComparePanel';
import Header from '@/widgets/shop-header/ui/Header';
import Footer from '@/widgets/shop-footer/ui/Footer';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Каталог техники и электроники | Texnobar',
  description:
    'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника с доставкой по Беларуси.',
  openGraph: {
    title: 'Каталог техники и электроники | Texnobar',
    description:
      'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника.',
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Каталог техники и электроники | Texnobar',
    description:
      'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника.',
  },
};

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ComparePanel />
      <Footer />
    </>
  );
}
