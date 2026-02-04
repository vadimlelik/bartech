import { Roboto } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from './registry';
import ClientLayout from '@/components/ClientLayout';
import Providers from '@/components/Providers';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bartech.by';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bartech - Интернет-магазин техники в Минске',
    template: '%s | Texnobar',
  },
  description:
    'Купить технику в Минске с доставкой. Широкий ассортимент телефонов, ноутбуков, телевизоров и другой электроники. Рассрочка без переплат.',
  keywords: [
    'техника',
    'электроника',
    'купить технику в минске',
    'купить электронику в минске',
    'телефоны',
    'ноутбуки',
    'телевизоры',
    'интернет-магазин техники',
    'техника в рассрочку',
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
    title: 'Texnobar - Интернет-магазин техники в Минске',
    description:
      'Купить технику в Минске с доставкой. Широкий ассортимент телефонов, ноутбуков, телевизоров и другой электроники.',
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
    title: 'Texnobar - Интернет-магазин техники в Минске',
    description:
      'Купить технику в Минске с доставкой. Широкий ассортимент телефонов, ноутбуков, телевизоров и другой электроники.',
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
