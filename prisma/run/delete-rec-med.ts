import { PrismaClient } from '@prisma/client';

export const deleteRecMed = async (prisma: PrismaClient) => {
  const x = await prisma.recMed.deleteMany({
    where: { medName: '', recName: '' },
  });
  const x2 = await prisma.recMed.deleteMany({
    where: { medName: null, recName: '' },
  });
  const x3 = await prisma.recMed.deleteMany({
    where: { medName: null, recName: null },
  });
  const x4 = await prisma.recMed.deleteMany({
    where: { medName: null, recName: '' },
  });

  const x5 = await prisma.recMed.deleteMany({
    where: { recName: 'Não identificada' },
  });

  const x6 = await prisma.recMed.deleteMany({
    where: { recName: 'Não informada' },
  });

  const x7 = await prisma.recMed.deleteMany({
    where: { recName: 'Não aplicável' },
  });

  console.log({ x, x4, x2, x3, x5, x6, x7 });
};
