import { prisma } from '@/shared/lib/prisma';

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

function buildSearchWhere(search) {
  const query = search?.trim();
  if (!query) return {};

  return {
    OR: [
      { phone: { contains: query, mode: 'insensitive' } },
      { source: { contains: query, mode: 'insensitive' } },
      { pagePath: { contains: query, mode: 'insensitive' } },
      { title: { contains: query, mode: 'insensitive' } },
      { name: { contains: query, mode: 'insensitive' } },
      { comments: { contains: query, mode: 'insensitive' } },
      { utmSource: { contains: query, mode: 'insensitive' } },
      { utmCampaign: { contains: query, mode: 'insensitive' } },
      { utmTerm: { contains: query, mode: 'insensitive' } },
    ],
  };
}

export async function listFormSubmissions({ page = 1, limit = 40, search = '' } = {}) {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safeLimit = Math.min(Math.max(Number.isNaN(limit) ? 40 : limit, 1), 100);
  const where = buildSearchWhere(search);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
    }),
    prisma.formSubmission.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function findFormSubmissionsForExport({ search = '', max = 10000 } = {}) {
  return prisma.formSubmission.findMany({
    where: buildSearchWhere(search),
    orderBy: { createdAt: 'desc' },
    take: max,
  });
}
