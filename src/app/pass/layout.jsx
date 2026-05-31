import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { ROBOTS_NOINDEX_FOLLOW } from '@/shared/lib/landing-seo';

export const metadata = {
  title: 'Условия рассрочки | Texnobar',
  description:
    'Перечень данных и условия оформления рассрочки в интернет-магазине Texnobar.',
  alternates: {
    canonical: `${siteUrl}/pass`,
  },
  robots: ROBOTS_NOINDEX_FOLLOW,
};

export default function PassLayout({ children }) {
  return children;
}
