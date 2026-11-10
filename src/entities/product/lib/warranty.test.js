import test from 'node:test';
import assert from 'node:assert/strict';
import { productWarrantyText } from './warranty.js';

test('в блоке гарантии срок товара, а без своего срока — год магазина', () => {
  assert.equal(productWarrantyText({}), 'Гарантия 1 год.');
  assert.equal(productWarrantyText({ warranty: '2 года' }), 'Гарантия 2 года.');
  assert.equal(productWarrantyText({ warranty: 'Гарантия производителя' }), 'Гарантия производителя.');
});
