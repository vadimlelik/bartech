'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LEAD_POPUP_DELAY_MS,
  LEAD_POPUP_STORAGE,
  LEAD_POPUP_SUBMIT_COOLDOWN_MS,
  isLeadPopupAllowedPath,
} from './constants';

function isSubdomain() {
  if (typeof window === 'undefined') return false;
  return /^([^.]+)\.technobar\.ru$/.test(window.location.hostname);
}

function shouldSkipPopup() {
  if (isSubdomain()) return true;

  if (sessionStorage.getItem(LEAD_POPUP_STORAGE.DISMISSED)) {
    return true;
  }

  const submittedAt = localStorage.getItem(LEAD_POPUP_STORAGE.SUBMITTED);
  if (submittedAt) {
    const elapsed = Date.now() - Number.parseInt(submittedAt, 10);
    if (elapsed < LEAD_POPUP_SUBMIT_COOLDOWN_MS) {
      return true;
    }
  }

  return false;
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
    sessionStorage.setItem(LEAD_POPUP_STORAGE.DISMISSED, '1');
    setIsOpen(false);
  };

  const markSubmitted = () => {
    localStorage.setItem(LEAD_POPUP_STORAGE.SUBMITTED, String(Date.now()));
    sessionStorage.setItem(LEAD_POPUP_STORAGE.DISMISSED, '1');
  };

  return { isOpen, dismiss, markSubmitted, setIsOpen };
}
