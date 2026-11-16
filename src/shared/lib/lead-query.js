const SEARCH_FIELDS = [
  'phone',
  'source',
  'pagePath',
  'title',
  'name',
  'comments',
  'utmSource',
  'utmCampaign',
  'utmTerm',
];

function clip(value, max = 255) {
  return String(value ?? '').trim().slice(0, max);
}

export function parseLeadDate(value) {
  if (value == null || value === '') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseLeadFilters(input = {}, { strictDates = false } = {}) {
  const fromRaw = input.from ?? '';
  const toRaw = input.to ?? '';
  let from = fromRaw ? parseLeadDate(fromRaw) : null;
  let to = toRaw ? parseLeadDate(toRaw) : null;

  if (strictDates && fromRaw && !from) {
    return { error: 'Некорректная дата начала' };
  }
  if (strictDates && toRaw && !to) {
    return { error: 'Некорректная дата окончания' };
  }

  if (from && to && from.getTime() > to.getTime()) {
    const swap = from;
    from = to;
    to = swap;
  }

  return {
    filters: {
      search: clip(input.search, 200),
      from,
      to,
      source: clip(input.source),
      utm: clip(input.utm),
    },
  };
}

export function parseLeadQuery(searchParams) {
  const parsed = parseLeadFilters({
    search: searchParams.get('search'),
    from: searchParams.get('from'),
    to: searchParams.get('to'),
    source: searchParams.get('source'),
    utm: searchParams.get('utm'),
  });
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 40);

  return {
    ...parsed.filters,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 100) : 40,
  };
}

export function parseLeadIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
    return { error: 'Укажите от 1 до 100 заявок' };
  }

  const unique = [];
  const seen = new Set();
  for (const raw of ids) {
    const id = String(raw ?? '').trim();
    if (!id || id.length > 64 || /\s/.test(id)) {
      return { error: 'Некорректный идентификатор заявки' };
    }
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }

  return { ids: unique };
}

export function hasLeadFilter(filters) {
  return Boolean(filters?.search || filters?.from || filters?.to || filters?.source || filters?.utm);
}

export function leadWhere(query) {
  const and = [];
  const search = query.search?.trim();

  if (search) {
    and.push({
      OR: SEARCH_FIELDS.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    });
  }

  if (query.from || query.to) {
    and.push({
      createdAt: {
        ...(query.from ? { gte: query.from } : {}),
        ...(query.to ? { lte: query.to } : {}),
      },
    });
  }

  if (query.source) and.push({ source: query.source });

  if (query.utm) {
    and.push({
      OR: [
        { utmSource: query.utm },
        { AND: [{ utmSource: null }, { utmCampaign: query.utm }] },
        { AND: [{ utmSource: '' }, { utmCampaign: query.utm }] },
      ],
    });
  }

  if (and.length === 0) return {};
  if (and.length === 1) return and[0];
  return { AND: and };
}
