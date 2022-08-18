import { PrismaClient } from '@prisma/client';

import { connapaCover } from './run/connapa-cover';

const prisma = new PrismaClient();

async function main() {
  console.log('start');
  // fs.readFile('text.txt', 'utf8', function (err, data) {
  //   if (err) throw err;
  //   console.log(data.split('\n'));
  // });

  // try {
  //   const x = await prisma.activity.delete({
  //     where: { code: '0' },
  //   });
  //   console.log(x);
  //   // await convertProf(prisma);
  // } catch (error) {
  //   console.log(error);
  //   console.log('error: end');
  // }
  connapaCover(prisma);
  console.log('end');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
