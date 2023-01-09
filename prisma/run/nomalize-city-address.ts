import { PrismaClient } from '@prisma/client';

export const normCityAddress = async (prisma: PrismaClient) => {
  const test = await prisma.addressCompany.findMany({ select: { id: true, city: true } });
  const test2 = await prisma.address.findMany({ select: { id: true, city: true } });

  await Promise.all(
    test.map(async (t) => {
      await prisma.addressCompany.update({
        where: { id: t.id },
        data: {
          city: t.city
            .toLocaleUpperCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim(),
        },
      });
    }),
  );

  await Promise.all(
    test2.map(async (t) => {
      await prisma.address.update({
        where: { id: t.id },
        data: {
          city: t.city
            .toLocaleUpperCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim(),
        },
      });
    }),
  );
};
