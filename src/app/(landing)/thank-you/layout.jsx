import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Спасибо за заявку | Texnobar',
  description:
    'Ваша заявка успешно отправлена. Менеджер Texnobar свяжется с вами в ближайшее время.',
  alternates: {
    canonical: `${siteUrl}/thank-you`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({ children }) {
  return children;
}
