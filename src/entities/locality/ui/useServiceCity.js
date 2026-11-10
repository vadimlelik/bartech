'use client';

import { useCity } from '@/entities/city';
import { resolveServiceCity } from '../lib/service-city';
import { useLocality } from './LocalityProvider';

export function useServiceCity() {
  const { commerceCity, pageCity, cities } = useCity();
  const { locality } = useLocality();
  return resolveServiceCity(locality, cities, commerceCity || pageCity);
}
