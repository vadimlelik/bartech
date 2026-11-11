'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  internalNavigationUrl,
  onRouteProgressStart,
  patchAppRouter,
} from '@/shared/lib/route-progress';

const SHOW_DELAY_MS = 180;
const MIN_VISIBLE_MS = 280;
const MAX_VISIBLE_MS = 8000;

function browserRouteKey() {
  const search = window.location.search.startsWith('?')
    ? window.location.search.slice(1)
    : window.location.search;
  return `${window.location.pathname}?${search}`;
}

export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const routeKey = `${pathname}?${searchParams?.toString() || ''}`;
  const routeKeyRef = useRef(routeKey);
  const renderedRouteRef = useRef(routeKey);
  renderedRouteRef.current = routeKey;
  const runningRef = useRef(false);
  const visibleSinceRef = useRef(0);
  const showTimerRef = useRef(0);
  const safetyTimerRef = useRef(0);

  useEffect(() => {
    patchAppRouter(router);
  }, [router]);

  useEffect(() => {
    const stop = () => {
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
      runningRef.current = false;
      visibleSinceRef.current = 0;
      setVisible(false);
    };

    const show = () => {
      const startedRoute = renderedRouteRef.current;
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
      runningRef.current = true;
      visibleSinceRef.current = 0;
      showTimerRef.current = window.setTimeout(() => {
        if (!runningRef.current) return;
        const reactNow = renderedRouteRef.current;
        const browserNow = browserRouteKey();
        // React уже показывает адрес из строки. Индикатор здесь только зависнет:
        // «назад» из кэша успевает вернуть страницу раньше таймера.
        if (reactNow === browserNow && reactNow !== startedRoute) {
          stop();
          return;
        }
        visibleSinceRef.current = Date.now();
        setVisible(true);
        safetyTimerRef.current = window.setTimeout(stop, MAX_VISIBLE_MS);
      }, SHOW_DELAY_MS);
    };

    const onPopState = () => {
      // popstate приходит, когда браузер уже сменил адрес. Если экран уже тот же,
      // запускать индикатор нельзя: маршрут больше не изменится и чип не снимется.
      if (renderedRouteRef.current === browserRouteKey()) return;
      show();
    };

    const stopListening = onRouteProgressStart(show);

    const onClick = (event) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (!internalNavigationUrl(anchor.getAttribute('href'), window.location.href)) return;
      show();
    };

    const onSubmit = (event) => {
      if (event.defaultPrevented) return;
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if ((form.method || 'get').toLowerCase() !== 'get') return;
      show();
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit);
    window.addEventListener('popstate', onPopState, true);

    return () => {
      stopListening();
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit);
      window.removeEventListener('popstate', onPopState, true);
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return undefined;
    routeKeyRef.current = routeKey;
    if (!runningRef.current) return undefined;

    const finish = () => {
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
      runningRef.current = false;
      visibleSinceRef.current = 0;
      setVisible(false);
    };

    if (!visibleSinceRef.current) {
      finish();
      return undefined;
    }

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - visibleSinceRef.current));
    const timer = window.setTimeout(finish, wait);
    return () => window.clearTimeout(timer);
  }, [routeKey]);

  if (!visible) return null;

  return (
    <>
      <div className="route-progress" aria-hidden="true">
        <span className="route-progress__bar" />
      </div>
      <div className="route-progress__chip" role="status" aria-live="polite">
        <span className="route-progress__spin" aria-hidden="true" />
        Загрузка…
      </div>
    </>
  );
}
