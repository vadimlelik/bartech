'use client';

import { useEffect } from 'react';
import { useCity } from '@/entities/city';
import { GA_TRACKING_ID } from '@/shared/lib/gtag';
import { YANDEX_METRIKA_ID } from '@/shared/config/yandex-metrika';

export function trackCityEvent(action, params = {}) {
  if (typeof window === 'undefined') return;
  const payload = { ...params };
  delete payload.phone;
  delete payload.email;
  delete payload.name;
  delete payload.address;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: action, ...payload });

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, payload);
  }
}

export default function CityAnalytics() {
  const { pageCity, commerceCity } = useCity();
  const pageSlug = pageCity?.slug;
  const commerceSlug = commerceCity?.slug;

  useEffect(() => {
    if (!pageSlug) return;
    const city = commerceSlug || pageSlug;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ city, page_city: pageSlug });

    if (typeof window.gtag === 'function') {
      window.gtag('set', { city, page_city: pageSlug });
      window.gtag('config', GA_TRACKING_ID, {
        page_path: window.location.pathname,
        city,
        page_city: pageSlug,
      });
    }

    if (typeof window.ym === 'function') {
      window.ym(YANDEX_METRIKA_ID, 'params', { city, page_city: pageSlug });
    }
  }, [pageSlug, commerceSlug]);

  return null;
}
