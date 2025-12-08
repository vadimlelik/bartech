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

export default function ShopCookieConsent() {
  const pathname = usePathname();
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Проверяем поддомен после монтирования компонента
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Проверяем, является ли это поддоменом *.cvirko-vadim.ru (но не основным доменом)
      // Основной домен: cvirko-vadim.ru, bartech.by
      // Поддомены: phone.cvirko-vadim.ru, phone6.cvirko-vadim.ru и т.д.
      const mainDomains = ['cvirko-vadim.ru', 'bartech.by', 'www.cvirko-vadim.ru', 'www.bartech.by'];
      const isMainDomain = mainDomains.includes(hostname);
      const isSubdomainCheck = !isMainDomain && hostname.includes('.cvirko-vadim.ru');
      
      setIsSubdomain(isSubdomainCheck);
      
      // Отладочная информация (можно удалить после проверки)
      if (process.env.NODE_ENV === 'development') {
        console.log('ShopCookieConsent - hostname:', hostname, 'isSubdomain:', isSubdomainCheck, 'isMainDomain:', isMainDomain);
      }
    }
  }, []);

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

  // Не показываем cookie consent на поддоменах или до монтирования
  if (!mounted || isSubdomain) {
    return null;
  }

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
      <CookieConsent onAccept={handleCookieAccept} />
    </>
  );
}

