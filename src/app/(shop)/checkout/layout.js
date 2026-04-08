import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Оформление заказа | Texnobar',
  description:
    'Оформление заказа в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/checkout`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }) {
  return children;
}
