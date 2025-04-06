import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: ['query'],
});

async function main() {
  try {
    console.info('start');

    const data = await prisma.riskFactorDataRecPhoto.findMany({
      where: { deleted_at: null },
      include: { file: true },
    });

    await Promise.all(
      data.map(async (item) => {
        await prisma.systemFile.update({
          where: { id: item.file_id },
          data: {
            deleted_at: null,
            should_delete: false,
          },
        });
      }),
    );

    const array = data.map((item) => {
      return item.file.url.split('/').at(-1);
    });

    console.log('data', array);

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
