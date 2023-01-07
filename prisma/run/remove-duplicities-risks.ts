import { PrismaClient } from '@prisma/client';

import { RiskFactorDataEntity } from '../../src/modules/sst/entities/riskData.entity';
import { getMatrizRisk } from '../../src/shared/utils/matriz';

export const removeDuplicitiesRisks = async (prisma: PrismaClient) => {
  const riskDataPrisma = await prisma.riskFactors.groupBy({
    by: ['name'],
    _count: true,
  });

  const risk = riskDataPrisma.filter((i) => i._count > 1);

  const up = await prisma.riskFactors.updateMany({
    where: { name: { in: risk.map((n) => n.name) }, system: { not: true } },
    data: { deleted_at: new Date() },
  });
};
