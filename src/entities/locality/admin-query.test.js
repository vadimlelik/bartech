import test from 'node:test';
import assert from 'node:assert/strict';
import { localityAdminWhere, parseLocalityAdminQuery } from './lib/admin-query.js';

test('фильтры админки ищут по нормализованному названию и области', () => {
  const query = parseLocalityAdminQuery(new URLSearchParams('q=Ёлки&regionId=4&popular=1&active=0&page=2'));
  assert.equal(query.q, 'елки');
  assert.equal(query.regionId, 4);
  assert.equal(query.popular, true);
  assert.equal(query.active, false);
  assert.equal(query.page, 2);
  assert.deepEqual(localityAdminWhere(query), {
    nameNorm: { contains: 'елки' },
    district: { regionId: 4 },
    isPopular: true,
    isActive: false,
  });
});
