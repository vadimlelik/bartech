import test from 'node:test';
import assert from 'node:assert/strict';
import { bannerMatchesCity, bannerPublicHref, normalizeBannerSlugs } from './banners.js';

test('баннер без городов виден везде, городской — только своему слагу', () => {
  assert.equal(bannerMatchesCity([], 'grodno'), true);
  assert.equal(bannerMatchesCity(['grodno'], 'grodno'), true);
  assert.equal(bannerMatchesCity(['grodno'], 'minsk'), false);
  assert.equal(bannerMatchesCity([' Grodno '], 'grodno'), true);
  assert.deepEqual(normalizeBannerSlugs('grodno, brest, grodno'), ['grodno', 'brest']);
});

test('пустая ссылка не становится адресом, внутренняя получает префикс города', () => {
  assert.equal(bannerPublicHref('  ', 'grodno', ['grodno']), '');
  assert.equal(bannerPublicHref('/sales', 'grodno', ['grodno']), '/sales');
  assert.equal(bannerPublicHref('/categories/phones', 'grodno', ['grodno']), '/grodno/categories/phones');
  assert.equal(bannerPublicHref('https://technobar.by/sales', 'grodno', ['grodno']), 'https://technobar.by/sales');
});
