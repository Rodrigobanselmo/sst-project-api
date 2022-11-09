import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

export const addProfCOuncilNUll = async (prisma: PrismaClient) => {
  const prof = await prisma.professional.findMany({
    where: { councils: { none: { id: { gt: 0 } } } },
    select: { councils: true, id: true },
  });

  await Promise.all(
    prof.map(async (prof) => {
      await prisma.professional.update({
        where: { id: prof.id },
        data: {
          councils: {
            create: { councilId: '', councilType: '', councilUF: '' },
          },
        },
      });
    }),
  );
};
