import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Политика обработки персональных данных | Texnobar',
  description:
    'Политика обработки персональных данных интернет-магазина Texnobar.',
  alternates: {
    canonical: `${siteUrl}/pk`,
  },
};

export default function PkLayout({ children }) {
  return children;
}
