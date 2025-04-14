import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: ['query'],
});

async function main() {
  try {
    console.info('start');

    const data = await prisma.riskFactors.findMany({
      where: { deleted_at: null },
    });

    for (const riskFactor of data) {
      const [name, ...rsdata] = riskFactor.name.split(';;');

      await prisma.riskFactors.update({
        where: { id: riskFactor.id },
        data: {
          name,
          rsdata: rsdata.join(';;'),
        },
      });
    }

    console.info('end');
  } catch (err) {
    console.error(err);
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
