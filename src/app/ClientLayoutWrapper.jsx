'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { usePathname } from 'next/navigation';
import StyledComponentsRegistry from './registry';
import { loadTikTokPixel } from '@/shared/utils';
import * as gtag from '@/lib/gtag';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Lazy load analytics scripts after page load
    const loadAnalytics = () => {
      // Initialize TikTok Pixel
      loadTikTokPixel('YOUR_PIXEL_ID_HERE');

      // Yandex.Metrika counter - load with delay
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
    };

    // Load analytics after page is interactive
    if (document.readyState === 'complete') {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAnalytics, { timeout: 2000 });
      } else {
        setTimeout(loadAnalytics, 2000);
      }
    } else {
      window.addEventListener('load', () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadAnalytics, { timeout: 2000 });
        } else {
          setTimeout(loadAnalytics, 2000);
        }
      });
    }
  }, []);

  useEffect(() => {
    gtag.pageview(pathname);
  }, [pathname]);

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}

