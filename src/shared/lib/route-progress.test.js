import test from 'node:test';
import assert from 'node:assert/strict';
import { internalNavigationUrl } from './route-progress.js';

const here = 'https://technobar.by/grodno';

test('индикатор нужен только при переходе на другую страницу этого сайта', () => {
  assert.equal(internalNavigationUrl('/contacts', here)?.pathname, '/contacts');
  assert.equal(internalNavigationUrl('https://technobar.by/cart', here)?.pathname, '/cart');
  assert.equal(internalNavigationUrl('/grodno', here), null);
  assert.equal(internalNavigationUrl('#delivery', here), null);
  assert.equal(internalNavigationUrl('mailto:a@b.c', here), null);
  assert.equal(internalNavigationUrl('https://example.com/cart', here), null);
});
