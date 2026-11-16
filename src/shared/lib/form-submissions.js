import { prisma } from '@/shared/lib/prisma';
import { leadWhere } from '@/shared/lib/lead-query';

function asString(value, max = 2000) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return text.slice(0, max);
}

function extractPhone(fields) {
  if (Array.isArray(fields.PHONE) && fields.PHONE[0]?.VALUE) {
    return asString(fields.PHONE[0].VALUE, 32);
  }
  if (typeof fields.PHONE === 'string') {
    return asString(fields.PHONE, 32);
  }
  return null;
}

function extractPagePath(req, fields) {
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).pathname || null;
    } catch {
      // ignore invalid referer
    }
  }

  const comments = asString(fields.COMMENTS, 4000) || '';
  const match = comments.match(/странице:\s+(\S+)/i);
  return match?.[1] || null;
}

function extractSource(pagePath, fields) {
  if (pagePath && pagePath !== '/') {
    return pagePath;
  }
  return (
    asString(fields.UF_CRM_1705470523, 255) ||
    asString(fields.SOURCE_DESCRIPTION, 255) ||
    asString(fields.TITLE, 255) ||
    'unknown'
  );
}

export function buildFormSubmissionData(req, fields) {
  const pagePath = extractPagePath(req, fields);

  return {
    source: extractSource(pagePath, fields),
    pagePath,
    title: asString(fields.TITLE, 500),
    name: asString(fields.NAME, 255),
    phone: extractPhone(fields),
    comments: asString(fields.COMMENTS, 8000),
    utmSource: asString(fields.UTM_SOURCE, 255),
    utmMedium: asString(fields.UTM_MEDIUM, 255),
    utmCampaign: asString(fields.UTM_CAMPAIGN, 255),
    utmContent: asString(fields.UTM_CONTENT, 255),
    utmTerm: asString(fields.UTM_TERM, 255),
    payload: fields,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    userAgent: asString(req.headers.get('user-agent'), 500),
  };
}

export async function saveFormSubmission(req, fields) {
  const data = buildFormSubmissionData(req, fields);
  return prisma.formSubmission.create({ data });
}

function addCount(map, value, count) {
  if (!value) return;
  map.set(value, (map.get(value) || 0) + count);
}

function sortOptions(map) {
  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'ru'));
}

export async function listLeadFilterOptions() {
  const [sources, utmSources, utmCampaigns] = await Promise.all([
    prisma.formSubmission.groupBy({
      by: ['source'],
      _count: { _all: true },
      orderBy: { source: 'asc' },
    }),
    prisma.formSubmission.groupBy({
      by: ['utmSource'],
      where: {
        AND: [
          { utmSource: { not: null } },
          { utmSource: { not: '' } },
        ],
      },
      _count: { _all: true },
      orderBy: { utmSource: 'asc' },
    }),
    prisma.formSubmission.groupBy({
      by: ['utmCampaign'],
      where: {
        AND: [
          { OR: [{ utmSource: null }, { utmSource: '' }] },
          { utmCampaign: { not: null } },
          { utmCampaign: { not: '' } },
        ],
      },
      _count: { _all: true },
      orderBy: { utmCampaign: 'asc' },
    }),
  ]);

  const sourceMap = new Map();
  for (const row of sources) addCount(sourceMap, row.source, row._count._all);

  const utmMap = new Map();
  for (const row of utmSources) addCount(utmMap, row.utmSource, row._count._all);
  for (const row of utmCampaigns) addCount(utmMap, row.utmCampaign, row._count._all);

  return {
    sources: sortOptions(sourceMap),
    utms: sortOptions(utmMap),
  };
}

export async function listFormSubmissions(query) {
  const where = leadWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [items, total, options] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    }),
    prisma.formSubmission.count({ where }),
    listLeadFilterOptions(),
  ]);

  return {
    items,
    options,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function findFormSubmissionsForExport(query, max = 10000) {
  return prisma.formSubmission.findMany({
    where: leadWhere(query),
    orderBy: { createdAt: 'desc' },
    take: max,
  });
}

export async function deleteFormSubmissionsByIds(ids) {
  const result = await prisma.formSubmission.deleteMany({
    where: { id: { in: ids } },
  });
  return result.count;
}

export async function deleteFormSubmissions(query) {
  const result = await prisma.formSubmission.deleteMany({
    where: leadWhere(query),
  });
  return result.count;
}
