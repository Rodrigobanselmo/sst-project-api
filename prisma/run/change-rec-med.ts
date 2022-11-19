import { PrismaClient } from '@prisma/client';

export const changeRecMed = async (prisma: PrismaClient) => {
  await prisma.recMed.updateMany({
    data: {
      medName: 'Não implementada',
    },
    where: { medName: 'Não identificada' },
  });
  await prisma.recMed.updateMany({
    data: {
      medName: 'Não verificada',
    },
    where: { medName: 'Não informada' },
  });
};
