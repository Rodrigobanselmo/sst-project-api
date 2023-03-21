import { PrismaClient } from '@prisma/client';

export const createEpi = async (prisma: PrismaClient) => {
  await prisma.epi.upsert({
    create: {
      ca: '1',
      description: 'Não implementada',
      equipment: 'Não implementada',
    },
    update: {},
    where: { ca_status: { ca: '1', status: 'ACTIVE' } },
  });

  await prisma.epi.upsert({
    create: {
      ca: '2',
      description: 'Não verificada',
      equipment: 'Não verificada',
    },
    update: {},
    where: { ca_status: { ca: '2', status: 'ACTIVE' } },
  });
};
