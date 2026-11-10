import test from 'node:test';
import assert from 'node:assert/strict';
import { loopbackApiUrl } from './loopback-url.js';

test('внутренний запрос middleware идёт на http://127.0.0.1, а не на https://0.0.0.0', () => {
  const url = loopbackApiUrl('https://0.0.0.0:3000/soligorsk', '/api/cities/slugs', '3000');
  assert.equal(url.href, 'http://127.0.0.1:3000/api/cities/slugs');
});

test('порт берётся из адреса, если PORT не задан', () => {
  const url = loopbackApiUrl('http://localhost:3001/brest', '/api/products/12', '');
  assert.equal(url.href, 'http://127.0.0.1:3001/api/products/12');
});
