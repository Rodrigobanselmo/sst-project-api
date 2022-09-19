import { PrismaClient } from '@prisma/client';
import { levelRiskData } from './run/level-risk-data';

import { representAll } from './run/represent-all';

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
  await levelRiskData(prisma);
  await representAll(prisma);
  console.log('end');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
