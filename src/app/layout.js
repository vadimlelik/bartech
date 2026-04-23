import { Roboto } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from './registry';
import ClientLayout from '@/widgets/client-shell/ui/ClientLayout';
import Providers from '@/widgets/app-providers/ui/Providers';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { COMMERCIAL_SEO_KEYWORDS } from '@/shared/lib/seo';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const SITE_DESCRIPTION =
  'Купить в рассрочку телефон, смартфон, телевизор, ноутбук и технику в Минске — Texnobar (technobar.by). Рассрочка без переплат, доставка по Беларуси, каталог с ценами.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Купить телефон, телевизор, ноутбук в рассрочку — Минск | Texnobar',
    template: '%s | Texnobar',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    ...COMMERCIAL_SEO_KEYWORDS,
    'texnobar',
    'technobar',
    'баратех',
    'technobar.by',
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
    title: 'Купить телефон, телевизор, ноутбук в рассрочку — Минск | Texnobar',
    description:
      'Купить в рассрочку телефон, телевизор, ноутбук в Минске. Texnobar — доставка по Беларуси, каталог, рассрочка без переплат.',
    images: [
      {
        url: `${siteUrl}/logo_techno_bar.svg`,
        width: 1200,
        height: 630,
        alt: 'Texnobar - Интернет-магазин техники в Минске',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить телефон, телевизор, ноутбук в рассрочку — Минск | Texnobar',
    description:
      'Купить в рассрочку телефон, телевизор, ноутбук в Минске. Texnobar — доставка по Беларуси, каталог, рассрочка без переплат.',
    images: [`${siteUrl}/logo_techno_bar.svg`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'geo.region': 'BY-HM',
    'geo.placename': 'Минск',
    'geo.position': '53.9085;27.5685',
    ICBM: '53.9085, 27.5685',
  },
  verification: {
    // google: 'your-google-verification-code',
    yandex: '93234b36ea40cbc7',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={roboto.className}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KLF56CZ4');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={SITE_DESCRIPTION} />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KLF56CZ4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <StyledComponentsRegistry>
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
