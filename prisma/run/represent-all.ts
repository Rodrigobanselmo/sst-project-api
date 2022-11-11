import { PrismaClient } from '@prisma/client';

export const representAll = async (prisma: PrismaClient) => {
  await prisma.riskFactors.create({
    data: {
      name: 'Todos',
      system: true,
      companyId: 'b8635456-334e-4d6e-ac43-cfe5663aee17',
      severity: 0,
      representAll: true,
      type: 'OUTROS',
    },
  });
};
