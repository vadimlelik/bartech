import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const body = await req.json();
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  globalThis._quiz ??= {};
  const last = globalThis._quiz[ip];
  if (last && Date.now() - last < 60 * 5 * 1000) {
    return NextResponse.json(
      { success: false, reason: 'rate_limited' },
      { status: 429 }
    );
  }
  globalThis._quiz[ip] = Date.now();
  await axios.post(
    'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
    {
      FIELDS: body.FIELDS,
    }
  );
  return NextResponse.json({ success: true });
}
