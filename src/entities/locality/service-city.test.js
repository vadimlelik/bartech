import test from 'node:test';
import assert from 'node:assert/strict';
import { parseServiceCitySlug, resolveServiceCity } from './lib/service-city.js';

const cities = [
  { slug: 'minsk', name: 'Минск' },
  { slug: 'grodno', name: 'Гродно' },
];

test('без привязки доставка остаётся у города страницы', () => {
  const fallback = cities[1];
  assert.equal(resolveServiceCity({ serviceCitySlug: null }, cities, fallback), fallback);
  assert.equal(resolveServiceCity(null, cities, fallback), fallback);
  assert.equal(resolveServiceCity({ serviceCitySlug: 'vitebsk' }, cities, fallback), fallback);
});

test('привязка населённого пункта выбирает город обслуживания', () => {
  const city = resolveServiceCity({ id: 4, serviceCitySlug: 'minsk' }, cities, cities[1]);
  assert.equal(city.slug, 'minsk');
});

test('пустая привязка сохраняется как отсутствие города', () => {
  assert.deepEqual(parseServiceCitySlug(''), { slug: null });
  assert.deepEqual(parseServiceCitySlug(null), { slug: null });
  assert.equal(parseServiceCitySlug('Гродно').error !== '', true);
  assert.deepEqual(parseServiceCitySlug('grodno'), { slug: 'grodno' });
});
