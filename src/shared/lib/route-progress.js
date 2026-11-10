const START_EVENT = 'bartech:route-progress';

export function internalNavigationUrl(href, currentHref) {
  const raw = String(href || '').trim();
  if (!raw || raw.startsWith('#')) return null;
  const lower = raw.toLowerCase();
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('javascript:')
  ) {
    return null;
  }
  let next;
  let current;
  try {
    next = new URL(raw, currentHref);
    current = new URL(currentHref);
  } catch {
    return null;
  }
  if (next.origin !== current.origin) return null;
  if (next.pathname === current.pathname && next.search === current.search) return null;
  return next;
}

export function startRouteProgress(href) {
  if (typeof window === 'undefined') return;
  if (href !== undefined && !internalNavigationUrl(href, window.location.href)) return;
  window.dispatchEvent(new CustomEvent(START_EVENT));
}

export function onRouteProgressStart(listener) {
  window.addEventListener(START_EVENT, listener);
  return () => window.removeEventListener(START_EVENT, listener);
}

let routerPatched = false;

export function patchAppRouter(router) {
  if (routerPatched || !router || typeof router.push !== 'function') return;
  routerPatched = true;
  const push = router.push.bind(router);
  const replace = router.replace.bind(router);
  router.push = (href, options) => {
    startRouteProgress(typeof href === 'string' ? href : '');
    return push(href, options);
  };
  router.replace = (href, options) => {
    startRouteProgress(typeof href === 'string' ? href : '');
    return replace(href, options);
  };
}
