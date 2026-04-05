import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient();
}

prisma = globalForPrisma.__prisma;

export { prisma };


