'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  internalNavigationUrl,
  onRouteProgressStart,
  patchAppRouter,
} from '@/shared/lib/route-progress';

const MIN_VISIBLE_MS = 400;
const MAX_VISIBLE_MS = 12000;

export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const routeKey = `${pathname}?${searchParams?.toString() || ''}`;
  const routeKeyRef = useRef(routeKey);
  const runningRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    patchAppRouter(router);
  }, [router]);

  useEffect(() => {
    let safetyTimer = 0;

    const show = () => {
      runningRef.current = true;
      startedAtRef.current = Date.now();
      setVisible(true);
      window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(() => {
        runningRef.current = false;
        setVisible(false);
      }, MAX_VISIBLE_MS);
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
    window.addEventListener('popstate', show);

    return () => {
      stopListening();
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit);
      window.removeEventListener('popstate', show);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return;
    routeKeyRef.current = routeKey;
    if (!runningRef.current) return undefined;
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAtRef.current));
    const timer = window.setTimeout(() => {
      runningRef.current = false;
      setVisible(false);
    }, wait);
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
