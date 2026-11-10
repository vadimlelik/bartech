import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatLocalityLabel,
  formatLocalityShort,
  parseLocalityId,
} from './lib/selection.js';

test('строка города показывает тип, область и район', () => {
  assert.equal(
    formatLocalityLabel({
      type: 'д.',
      name: 'Адамово',
      region: 'Витебская область',
      district: 'Браславский район',
    }),
    'д. Адамово [Витебская обл., Браславский район]',
  );
  assert.equal(formatLocalityShort({ type: 'г.', name: 'Минск' }), 'г. Минск');
  assert.equal(formatLocalityShort(null), 'г. Минск');
});

test('id населённого пункта — целое число больше нуля', () => {
  assert.equal(parseLocalityId(12), 12);
  assert.equal(parseLocalityId('12'), 12);
  assert.equal(parseLocalityId('0'), null);
  assert.equal(parseLocalityId('1.5'), null);
  assert.equal(parseLocalityId('минск'), null);
});
