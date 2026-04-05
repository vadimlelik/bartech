/**
 * Во время `next build` DATABASE_URL часто указывает на localhost, а Postgres не запущен.
 * Prisma кидает PrismaClientInitializationError — это ожидаемо, приложение уже уходит в JSON/[].
 * Не засоряем лог сборки красными stack trace.
 */
export function isPrismaUnreachableDuringNextBuild(error) {
  if (process.env.NEXT_PHASE !== 'phase-production-build') return false;
  if (!error || typeof error !== 'object') return false;
  return error.name === 'PrismaClientInitializationError';
}

export function logDbFallbackUnlessBuildWithoutDb(message, error) {
  if (isPrismaUnreachableDuringNextBuild(error)) return;
  console.error(message, error);
}
