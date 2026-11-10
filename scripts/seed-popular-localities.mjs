import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  POPULAR_LOCALITY_NAMES,
  pickPopularLocalities,
} from '../src/entities/locality/lib/import-plan.js';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.locality.findMany({
    select: {
      id: true,
      name: true,
      nameNorm: true,
      type: true,
      population: true,
      isPopular: true,
    },
  });
  const { picks, missing } = pickPopularLocalities(rows);
  let marked = 0;
  let already = 0;
  for (const pick of picks) {
    if (pick.isPopular) {
      already += 1;
      continue;
    }
    await prisma.locality.update({
      where: { id: pick.id },
      data: { isPopular: true },
    });
    marked += 1;
    console.log(`Популярный: ${pick.type} ${pick.name}`);
  }
  console.log(`Помечено: ${marked}. Уже были популярными: ${already}. Не найдены: ${missing.length}.`);
  if (missing.length) {
    console.log(`Нет в справочнике: ${missing.join(', ')}. Сначала запустите импорт.`);
  }
  if (picks.length !== POPULAR_LOCALITY_NAMES.length) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
