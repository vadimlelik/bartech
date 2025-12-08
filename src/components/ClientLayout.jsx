'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { loadTikTokPixel } from '@/shared/utils';
import * as gtag from '@/lib/gtag';
import CookieConsent from './CookieConsent';

const COOKIE_CONSENT_KEY = 'cookie-consent';

const hasCookieConsent = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
};

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

  // Проверяем, является ли текущая страница частью shop (а не landing)
  const isShopPage = () => {
    // Список путей лендингов, которые НЕ должны показывать cookie banner
    const landingPaths = [
      '/phone6',
      '/tv3',
      '/bicycles',
      '/laptop',
      '/laptop2',
      '/motoblok',
      '/motoblok1',
      '/motoblok2',
      '/pc',
      '/phone',
      '/phone2',
      '/phone3',
      '/phone4',
      '/phone5',
      '/scooter',
      '/shockproof-phone',
      '/tv1',
      '/tv2',
      '/1phonefree',
      '/50discount',
      '/thank-you',
    ];
    
    // Если путь является лендингом, не показываем cookie banner
    if (landingPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
      return false;
    }
    
    // Все остальные пути (включая корневой) считаются shop
    return true;
  };

  // Загружаем аналитику только если есть согласие
  const loadAnalytics = () => {
    if (analyticsLoaded || typeof window === 'undefined') return;

    // Загружаем Yandex Metrica
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

    // Загружаем TikTok Pixel только если есть ID
    const tiktokPixelId = 'YOUR_PIXEL_ID_HERE';
    if (tiktokPixelId && tiktokPixelId !== 'YOUR_PIXEL_ID_HERE') {
      loadTikTokPixel(tiktokPixelId);
    }

    setAnalyticsLoaded(true);
  };

  // Проверяем согласие при монтировании
  useEffect(() => {
    if (hasCookieConsent()) {
      loadAnalytics();
    }
  }, []);

  // Обработчик принятия согласия
  const handleCookieAccept = () => {
    loadAnalytics();
    // Динамически загружаем Google Analytics после согласия
    if (typeof window !== 'undefined') {
      // Проверяем, не загружен ли уже gtag
      const existingScript = document.querySelector('script[src*=\'googletagmanager.com/gtag/js\']');
      if (!existingScript && !window.dataLayer) {
        // Загружаем gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`;
        script.onload = () => {
          // Инициализируем gtag после загрузки скрипта
          window.dataLayer = window.dataLayer || [];
          window.gtag = function() {
            window.dataLayer.push(arguments);
          };
          window.gtag('js', new Date());
          window.gtag('config', gtag.GA_TRACKING_ID, {
            page_path: window.location.pathname,
          });
          // Отслеживаем текущую страницу
          gtag.pageview(pathname);
        };
        document.head.appendChild(script);
      } else if (window.gtag) {
        // Если gtag уже загружен, просто отслеживаем страницу
        gtag.pageview(pathname);
      }
    }
  };

  // Отслеживание изменений пути только если аналитика загружена
  useEffect(() => {
    if (analyticsLoaded && typeof window !== 'undefined' && window.gtag) {
      gtag.pageview(pathname);
    }
  }, [pathname, analyticsLoaded]);

  return (
    <>
      {hasCookieConsent() && (
        <>
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
        </>
      )}
      {isShopPage() && <CookieConsent onAccept={handleCookieAccept} />}
      {children}
    </>
  );
}

