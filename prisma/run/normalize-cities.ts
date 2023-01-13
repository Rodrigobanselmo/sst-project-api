import { normalizeString } from './../../src/shared/utils/normalizeString';
import { PrismaClient } from '@prisma/client';

export const normCities = async (prisma: PrismaClient) => {
  const c = await prisma.cities.findMany();
  await Promise.all(
    c.map(async (c) => {
      await prisma.cities.update({
        data: { normalized: normalizeString(c.name).toLocaleLowerCase() },
        where: { code: c.code },
      });
    }),
  );
};
