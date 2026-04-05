import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || '')
    .trim()
    .toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> <password>');
    console.error(
      '   or: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npm run create-admin'
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      fullName: 'Administrator',
      role: 'admin',
    },
    update: {
      passwordHash,
      role: 'admin',
    },
  });

  console.log('OK:', user.email, 'role=', user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
