import { PrismaClient } from '@prisma/client';

import { convertProf } from './run/convert-profissional';

const prisma = new PrismaClient();

async function main() {
  console.log('start');
  try {
    await convertProf(prisma);
  } catch (error) {
    console.log(error);
    console.log('error: end');
  }
  console.log('end');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
