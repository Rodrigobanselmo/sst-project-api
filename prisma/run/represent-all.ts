import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

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
