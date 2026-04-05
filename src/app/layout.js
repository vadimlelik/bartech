import { Roboto } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from './registry';
import ClientLayout from '@/widgets/client-shell/ui/ClientLayout';
import Providers from '@/widgets/app-providers/ui/Providers';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { SEO_INSTALLMENT_PHRASES } from '@/shared/lib/seo';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Купить в рассрочку в Минске — Texnobar | Телефоны и техника без переплат',
    template: '%s | Texnobar',
  },
  description:
    'Купить в рассрочку телефоны, ноутбуки и технику в Минске с доставкой. Интернет-магазин Texnobar: рассрочка без переплат, широкий выбор электроники.',
  keywords: [
    ...SEO_INSTALLMENT_PHRASES,
    'купить технику в минске',
    'купить электронику в минске',
    'телефоны',
    'ноутбуки',
    'телевизоры',
    'интернет-магазин техники',
    'texnobar',
    'technobar',
  ],
  authors: [{ name: 'Texnobar' }],
  creator: 'Texnobar',
  publisher: 'Texnobar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    url: siteUrl,
    siteName: 'Texnobar',
    title:
      'Купить в рассрочку в Минске — Texnobar | Телефоны и техника без переплат',
    description:
      'Купить в рассрочку телефоны, ноутбуки и технику в Минске. Доставка, рассрочка без переплат.',
    images: [
      {
        url: `${siteUrl}/logo_techno_bar.svg`,
        width: 1200,
        height: 630,
        alt: 'Texnobar - Интернет-магазин техники',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Купить в рассрочку в Минске — Texnobar | Телефоны и техника без переплат',
    description:
      'Купить в рассрочку телефоны, ноутбуки и технику в Минске. Доставка, рассрочка без переплат.',
    images: [`${siteUrl}/logo_techno_bar.svg`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Добавьте ваши коды верификации здесь при необходимости
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={roboto.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
