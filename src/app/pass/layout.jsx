import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Условия рассрочки | Texnobar',
  description:
    'Перечень данных и условия оформления рассрочки в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/pass`,
  },
};

export default function PassLayout({ children }) {
  return children;
}
