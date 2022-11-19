import { PrismaClient } from '@prisma/client';

export const normalizeUnitRisks = async (prisma: PrismaClient) => {
  await prisma.riskFactors.updateMany({
    data: {
      unit: 'mg/m3',
    },
    where: { unit: { contains: 'mg/', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: 'dB(A)',
    },
    where: { unit: { contains: 'db', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: 'f/cm3',
    },
    where: { unit: { contains: 'f/', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: 'mJ/cm2',
    },
    where: { unit: { contains: 'J/', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: 'lx',
    },
    where: { unit: { contains: 'Lux', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: '-',
    },
    where: { unit: { contains: 'NA', mode: 'insensitive' } },
  });
  await prisma.riskFactors.updateMany({
    data: {
      unit: null,
    },
    where: { unit: '' },
  });
};
