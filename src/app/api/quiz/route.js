import { NextResponse } from 'next/server';
import axios from 'axios';

const ALLOWED_FIELDS = ['NAME', 'PHONE', 'TITLE', 'COMMENTS', 'SOURCE_ID', 'SOURCE_DESCRIPTION'];

function sanitizeFields(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return {};
  const result = {};
  for (const key of ALLOWED_FIELDS) {
    if (fields[key] !== undefined) {
      result[key] = String(fields[key]).slice(0, 500);
    }
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

  await axios.post(webhookUrl, { FIELDS: fields });

  return NextResponse.json({ success: true });
}
