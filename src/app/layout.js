import { Roboto } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import * as gtag from '@/lib/gtag';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export default function RootLayout({ children }) {

  return (
    <html lang="ru" className={roboto.className}>
      <head>
        <meta
          name="description"
          content="Купить технику в Минске с доставкой"
        />
        <meta
          name="keywords"
          content="техника, электроника, купить технику в минске, купить электронику в минске"
        />
        <meta name="author" content="Bartech" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Bartech - Интернет-магазин техники"
        />
        <meta
          property="og:description"
          content="Купить технику в Минске с доставкой"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bartech.by" />
        <meta property="og:image" content="https://bartech.by/logo.png" />
        <meta property="og:site_name" content="Bartech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Bartech - Интернет-магазин техники"
        />
        <meta
          name="twitter:description"
          content="Купить технику в Минске с доставкой"
        />
        <meta name="twitter:image" content="https://bartech.by/logo.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
