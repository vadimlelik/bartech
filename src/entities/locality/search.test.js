import test from 'node:test';
import assert from 'node:assert/strict';
import {
  exactLocalityWhere,
  parseLocalitySearchParams,
  popularLocalityWhere,
  prefixLocalityWhere,
  selectLocalities,
} from './lib/search.js';

const rows = [
  { id: 1, name: 'Бор', nameNorm: 'бор', type: 'д.', region: 'Минская область', district: 'Борисовский район', slug: 'bor', population: 10, isActive: true, isPopular: false },
  { id: 2, name: 'Борисов', nameNorm: 'борисов', type: 'г.', region: 'Минская область', district: 'Борисовский район', slug: 'borisov', population: 100000, isActive: true, isPopular: true },
  { id: 3, name: 'Борки', nameNorm: 'борки', type: 'д.', region: 'Брестская область', district: 'Пинский район', slug: 'borki', population: 500, isActive: true, isPopular: false },
  { id: 4, name: 'Бор', nameNorm: 'бор', type: 'п.', region: 'Гомельская область', district: 'Гомельский район', slug: 'bor-gomel', population: 50, isActive: true, isPopular: false },
  { id: 5, name: 'Бор', nameNorm: 'бор', type: 'х.', region: 'Витебская область', district: 'Браславский район', slug: 'bor-hidden', population: 1000, isActive: false, isPopular: true },
  { id: 6, name: 'Ёлки', nameNorm: 'елки', type: 'д.', region: 'Минская область', district: 'Борисовский район', slug: 'elki', population: 20, isActive: true, isPopular: false },
  { id: 7, name: 'Минск', nameNorm: 'минск', type: 'г.', region: 'Минск', district: 'Минск', slug: 'minsk', population: 2000000, isActive: true, isPopular: true },
  { id: 8, name: 'Пинск', nameNorm: 'пинск', type: 'г.', region: 'Брестская область', district: 'Пинский район', slug: 'pinsk', population: 120000, isActive: false, isPopular: true },
];

function params(query) {
  return new URLSearchParams(query);
}

test('поиск не зависит от регистра и считает ё и е одним знаком', () => {
  const upper = parseLocalitySearchParams(params('q=БОР&limit=10'));
  const lower = parseLocalitySearchParams(params('q=бор'));
  assert.equal(upper.q, 'бор');
  assert.equal(lower.q, 'бор');
  assert.deepEqual(
    selectLocalities(rows, upper).map((item) => item.slug),
    selectLocalities(rows, lower).map((item) => item.slug),
  );

  const yo = parseLocalitySearchParams(params('q=Ёлки'));
  const ye = parseLocalitySearchParams(params('q=елки'));
  assert.equal(yo.q, 'елки');
  assert.equal(ye.q, 'елки');
  assert.deepEqual(selectLocalities(rows, yo), [
    { id: 6, name: 'Ёлки', type: 'д.', region: 'Минская область', district: 'Борисовский район', slug: 'elki' },
  ]);
});

test('пустой запрос возвращает только активные популярные города', () => {
  const parsed = parseLocalitySearchParams(params('q='));
  assert.equal(parsed.popular, true);
  assert.equal(parsed.limit, 15);
  const hits = selectLocalities(rows, parsed);
  assert.deepEqual(hits.map((item) => item.slug), ['minsk', 'borisov']);
});

test('сначала точное совпадение, затем начало названия, затем население', () => {
  const hits = selectLocalities(rows, { q: 'бор', limit: 10 });
  assert.deepEqual(hits.map((item) => item.slug), ['bor-gomel', 'bor', 'borisov', 'borki']);
  assert.equal(hits.some((item) => item.slug === 'bor-hidden'), false);
});

test('limit проверяется и не превышает 50', () => {
  assert.equal(typeof parseLocalitySearchParams(params('limit=0')).error, 'string');
  assert.equal(typeof parseLocalitySearchParams(params('limit=51')).error, 'string');
  assert.equal(typeof parseLocalitySearchParams(params('limit=abc')).error, 'string');
  assert.equal(parseLocalitySearchParams(params('limit=50')).limit, 50);
  assert.deepEqual(exactLocalityWhere('бор'), { isActive: true, nameNorm: 'бор' });
  assert.equal(prefixLocalityWhere('бор').NOT.nameNorm, 'бор');
  assert.deepEqual(popularLocalityWhere(), { isActive: true, isPopular: true });
});
