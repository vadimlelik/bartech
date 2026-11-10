'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CITY_COOKIE_NAME, withCityPrefix } from '@/shared/config/city-routes';

const CityContext = createContext(null);

function readCityCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function CityProvider({ pageCity, cities, lockCityToUrl = true, children }) {
  const [commerceSlug, setCommerceSlug] = useState(pageCity?.slug || 'minsk');

  useEffect(() => {
    if (lockCityToUrl) {
      setCommerceSlug(pageCity?.slug || 'minsk');
      return;
    }
    const slug = readCityCookie();
    if (slug && cities.some((city) => city.slug === slug)) {
      setCommerceSlug(slug);
      return;
    }
    setCommerceSlug(pageCity?.slug || 'minsk');
  }, [lockCityToUrl, pageCity?.slug, cities]);

  const value = useMemo(() => {
    const commerceCity = cities.find((city) => city.slug === commerceSlug) || pageCity;
    return {
      pageCity,
      commerceCity,
      cities,
      lockCityToUrl,
      href: (path) =>
        withCityPrefix(
          commerceCity?.slug || pageCity?.slug,
          path,
          cities.map((city) => city.slug),
        ),
      setCommerceSlug,
    };
  }, [commerceSlug, pageCity, cities, lockCityToUrl]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    return {
      pageCity: null,
      commerceCity: null,
      cities: [],
      lockCityToUrl: true,
      href: (path) => path,
      setCommerceSlug: () => {},
    };
  }
  return context;
}
