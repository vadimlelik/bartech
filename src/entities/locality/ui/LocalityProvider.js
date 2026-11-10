'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DEFAULT_LOCALITY,
  LOCALITY_CHANGE_EVENT,
  LOCALITY_STORAGE_KEY,
} from '../lib/selection';

const LocalityContext = createContext(null);

function storeLocality(locality) {
  if (typeof window === 'undefined' || !locality?.id) return;
  window.localStorage.setItem(LOCALITY_STORAGE_KEY, JSON.stringify(locality));
}

function publishLocality(locality) {
  storeLocality(locality);
  window.dispatchEvent(new CustomEvent(LOCALITY_CHANGE_EVENT, { detail: locality }));
}

export function LocalityProvider({ initialLocality, children }) {
  const router = useRouter();
  const [locality, setLocality] = useState(initialLocality || DEFAULT_LOCALITY);

  useEffect(() => {
    setLocality(initialLocality || DEFAULT_LOCALITY);
    storeLocality(initialLocality);
  }, [initialLocality]);

  const chooseLocality = useCallback(async (next) => {
    if (!next?.id) return false;
    try {
      const response = await fetch('/api/localities/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: next.id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.locality) return false;
      setLocality(data.locality);
      publishLocality(data.locality);
      router.refresh();
      return true;
    } catch {
      return false;
    }
  }, [router]);

  const value = useMemo(() => ({ locality, chooseLocality }), [locality, chooseLocality]);
  return <LocalityContext.Provider value={value}>{children}</LocalityContext.Provider>;
}

export function useLocality() {
  const context = useContext(LocalityContext);
  if (!context) {
    return { locality: DEFAULT_LOCALITY, chooseLocality: async () => false };
  }
  return context;
}
