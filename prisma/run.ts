import { PrismaClient } from '@prisma/client';

import { convertProf } from './run/convert-profissional';

const prisma = new PrismaClient();

async function main() {
  console.log('start');
  try {
    const x = await prisma.activity.delete({
      where: { code: '0' },
    });
    console.log(x);
    // await convertProf(prisma);
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
