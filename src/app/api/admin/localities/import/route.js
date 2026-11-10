import { spawn } from 'node:child_process';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { adminJsonError, serializeImportRun } from '../http';

export const dynamic = 'force-dynamic';

const STALE_MS = 3 * 60 * 60 * 1000;

async function latestRun() {
  const row = await prisma.localityImportRun.findFirst({ orderBy: { id: 'desc' } });
  if (row?.status === 'running' && Date.now() - row.createdAt.getTime() > STALE_MS) {
    return prisma.localityImportRun.update({
      where: { id: row.id },
      data: { status: 'failed', error: 'Импорт не завершился', finishedAt: new Date() },
    });
  }
  return row;
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ job: serializeImportRun(await latestRun()) });
  } catch (error) {
    return adminJsonError(error, 'GET /api/admin/localities/import');
  }
}

export async function POST() {
  try {
    await requireAdmin();
    const current = await latestRun();
    if (current?.status === 'running') {
      return NextResponse.json({ error: 'Импорт уже выполняется', job: serializeImportRun(current) }, { status: 409 });
    }
    const job = await prisma.localityImportRun.create({ data: { status: 'running' } });
    const child = spawn(process.execPath, [path.join(process.cwd(), 'scripts/import-localities.mjs')], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, LOCALITY_IMPORT_JOB_ID: String(job.id) },
    });
    child.unref();
    return NextResponse.json({ job: serializeImportRun(job) }, { status: 202 });
  } catch (error) {
    return adminJsonError(error, 'POST /api/admin/localities/import');
  }
}
