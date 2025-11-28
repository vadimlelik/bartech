'use client';

import { useEffect } from 'react';
import { Roboto } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Box } from '@mui/material';
import Script from 'next/script';
import StyledComponentsRegistry from './registry';
import { loadTikTokPixel } from '@/shared/utils';
import { usePathname } from 'next/navigation';
import * as gtag from '@/lib/gtag';
import { AuthProvider } from '@/contexts/AuthContext';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize TikTok Pixel
    loadTikTokPixel('YOUR_PIXEL_ID_HERE');

    // Yandex.Metrika counter
    const script = document.createElement('script');
    script.text = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(99038681, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `;
    document.head.appendChild(script);

    // Add noscript element for Yandex Metrika
    const noscript = document.createElement('noscript');
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'https://mc.yandex.ru/watch/99038681';
    img.style.position = 'absolute';
    img.style.left = '-9999px';
    img.alt = '';
    div.appendChild(img);
    noscript.appendChild(div);
    document.body.appendChild(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, []);

  useEffect(() => {
    gtag.pageview(pathname);
  }, [pathname]);

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
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
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
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {children}
              </Box>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
