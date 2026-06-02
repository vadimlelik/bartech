'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LEAD_POPUP_DELAY_MS, isLeadPopupAllowedPath } from './constants';

function isSubdomain() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;

  if (host === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return false;
  }

  return host.split('.').length > 2;
}

function shouldSkipPopup() {
  return isSubdomain();
}

export function useLeadPopupTrigger() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLeadPopupAllowedPath(pathname) || shouldSkipPopup()) {
      setIsOpen(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (isLeadPopupAllowedPath(pathname) && !shouldSkipPopup()) {
        setIsOpen(true);
      }
    }, LEAD_POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    setIsOpen(false);
  };

  return { isOpen, dismiss, setIsOpen };
}
