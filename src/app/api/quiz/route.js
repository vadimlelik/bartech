import { NextResponse } from 'next/server';
import axios from 'axios';

const ALLOWED_STRING_FIELDS = [
  'TITLE', 'COMMENTS', 'SOURCE_ID', 'SOURCE_DESCRIPTION',
  'STATUS_ID', 'OPENED', 'TYPE_ID', 'NAME', 'UF_CRM_1705470523',
  'UTM_SOURCE', 'UTM_MEDIUM', 'UTM_CAMPAIGN', 'UTM_CONTENT', 'UTM_TERM',
];

function sanitizeFields(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return {};
  const result = {};

  for (const key of ALLOWED_STRING_FIELDS) {
    if (fields[key] !== undefined) {
      result[key] = String(fields[key]).slice(0, 1000);
    }
  }

  // PHONE в Bitrix24 — массив объектов [{ VALUE, VALUE_TYPE }]
  if (Array.isArray(fields.PHONE)) {
    result.PHONE = fields.PHONE
      .filter((p) => p && typeof p === 'object')
      .slice(0, 3)
      .map((p) => ({
        VALUE: String(p.VALUE || '').replace(/[^\d+]/g, '').slice(0, 20),
        VALUE_TYPE: ['WORK', 'HOME', 'MOBILE'].includes(p.VALUE_TYPE) ? p.VALUE_TYPE : 'WORK',
      }));
  } else if (typeof fields.PHONE === 'string') {
    result.PHONE = [{ VALUE: fields.PHONE.replace(/[^\d+]/g, '').slice(0, 20), VALUE_TYPE: 'WORK' }];
  }

  return result;
}

export async function POST(req) {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('BITRIX24_WEBHOOK_URL is not configured');
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const body = await req.json();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  globalThis._quiz ??= {};
  const last = globalThis._quiz[ip];
  if (last && Date.now() - last < 60 * 1 * 1000) {
    return NextResponse.json(
      { success: false, reason: 'rate_limited' },
      { status: 429 }
    );
  }
  globalThis._quiz[ip] = Date.now();

  const fields = sanitizeFields(body.FIELDS);
  try {
    await axios.post(webhookUrl, { FIELDS: fields });
  } catch (err) {
    console.error('Bitrix24 webhook error:', err?.response?.data ?? err.message);
    return NextResponse.json({ success: false, reason: 'bitrix_error' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
