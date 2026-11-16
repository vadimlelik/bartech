import test from 'node:test';
import assert from 'node:assert/strict';
import { hasLeadFilter, leadWhere, parseLeadFilters, parseLeadIds, parseLeadQuery } from './lead-query.js';

test('пустая выборка заявок не сужает запрос', () => {
  const query = parseLeadQuery(new URLSearchParams());
  assert.equal(query.page, 1);
  assert.equal(query.limit, 40);
  assert.deepEqual(leadWhere(query), {});
});

test('выборка заявок сочетает период, источник и utm', () => {
  const query = parseLeadQuery(new URLSearchParams({
    search: ' 375 ',
    from: '2026-11-01T00:00:00.000Z',
    to: '2026-11-11T21:26:59.999Z',
    source: '/laptop29',
    utm: 'tiktok',
    page: '3',
    limit: '40',
  }));

  assert.equal(query.search, '375');
  assert.equal(query.source, '/laptop29');
  assert.equal(query.utm, 'tiktok');
  assert.equal(query.page, 3);
  assert.deepEqual(leadWhere(query), {
    AND: [
      {
        OR: [
          { phone: { contains: '375', mode: 'insensitive' } },
          { source: { contains: '375', mode: 'insensitive' } },
          { pagePath: { contains: '375', mode: 'insensitive' } },
          { title: { contains: '375', mode: 'insensitive' } },
          { name: { contains: '375', mode: 'insensitive' } },
          { comments: { contains: '375', mode: 'insensitive' } },
          { utmSource: { contains: '375', mode: 'insensitive' } },
          { utmCampaign: { contains: '375', mode: 'insensitive' } },
          { utmTerm: { contains: '375', mode: 'insensitive' } },
        ],
      },
      {
        createdAt: {
          gte: new Date('2026-11-01T00:00:00.000Z'),
          lte: new Date('2026-11-11T21:26:59.999Z'),
        },
      },
      { source: '/laptop29' },
      {
        OR: [
          { utmSource: 'tiktok' },
          { AND: [{ utmSource: null }, { utmCampaign: 'tiktok' }] },
          { AND: [{ utmSource: '' }, { utmCampaign: 'tiktok' }] },
        ],
      },
    ],
  });
});

test('перепутанные границы периода меняются местами', () => {
  const query = parseLeadQuery(new URLSearchParams({
    from: '2026-11-11T21:00:00.000Z',
    to: '2026-11-11T18:00:00.000Z',
  }));

  assert.equal(query.from.toISOString(), '2026-11-11T18:00:00.000Z');
  assert.equal(query.to.toISOString(), '2026-11-11T21:00:00.000Z');
});

test('список игнорирует битую дату, удаление выборки — нет', () => {
  const query = parseLeadQuery(new URLSearchParams({ from: 'вчера' }));
  assert.equal(query.from, null);
  assert.deepEqual(leadWhere(query), {});

  const parsed = parseLeadFilters({ from: 'вчера' }, { strictDates: true });
  assert.equal(parsed.error, 'Некорректная дата начала');
});

test('удаление всей таблицы без выборки не считается фильтром', () => {
  const query = parseLeadQuery(new URLSearchParams());
  assert.equal(hasLeadFilter(query), false);
  assert.equal(hasLeadFilter({ source: '/laptop29' }), true);
});

test('идентификаторы для удаления проверяются и схлопываются', () => {
  assert.deepEqual(parseLeadIds([' abc ', 'abc', 'def']).ids, ['abc', 'def']);
  assert.equal(parseLeadIds([]).error, 'Укажите от 1 до 100 заявок');
  assert.equal(parseLeadIds(['bad id']).error, 'Некорректный идентификатор заявки');
  assert.equal(parseLeadIds(new Array(101).fill('abc')).error, 'Укажите от 1 до 100 заявок');
});
