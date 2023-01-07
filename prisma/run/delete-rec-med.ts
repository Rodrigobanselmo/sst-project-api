import { PrismaClient } from '@prisma/client';

export const deleteRecMed = async (prisma: PrismaClient) => {
  await prisma.recMed.deleteMany({
    where: { medName: '', recName: '' },
  });
  await prisma.recMed.deleteMany({
    where: { medName: null, recName: '' },
  });
  await prisma.recMed.deleteMany({
    where: { medName: null, recName: null },
  });
  await prisma.recMed.deleteMany({
    where: { medName: null, recName: '' },
  });

  await prisma.recMed.deleteMany({
    where: { recName: 'Não identificada' },
  });

  await prisma.recMed.deleteMany({
    where: { recName: 'Não informada' },
  });

  await prisma.recMed.deleteMany({
    where: { recName: 'Não aplicável' },
  });
};
