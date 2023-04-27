import { normalizeToUpperString } from './../../src/shared/utils/normalizeString';
import { PrismaClient } from '@prisma/client';

export const changeRecMed = async (prisma: PrismaClient) => {
  const c = await prisma.addressCompany.findMany({ distinct: ['city'], select: { city: true } });
  const c2 = await prisma.address.findMany({ distinct: ['city'], select: { city: true } });

  await Promise.all(c.map(async ({ city }) => await prisma.addressCompany.updateMany({ data: { city: normalizeToUpperString(city) }, where: { city } })));
  await Promise.all(c2.map(async ({ city }) => await prisma.address.updateMany({ data: { city: normalizeToUpperString(city) }, where: { city } })));

  const c23 = await prisma.addressCompany.findMany({ distinct: ['city'], select: { city: true } });
  const c22 = await prisma.address.findMany({ distinct: ['city'], select: { city: true } });

  console.log(c23);
  console.log(c22);
};
