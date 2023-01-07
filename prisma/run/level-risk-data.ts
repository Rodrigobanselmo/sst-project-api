import { PrismaClient } from '@prisma/client';

import { RiskFactorDataEntity } from '../../src/modules/sst/entities/riskData.entity';
import { getMatrizRisk } from '../../src/shared/utils/matriz';

export const levelRiskData = async (prisma: PrismaClient) => {
  const riskDataPrisma = await prisma.riskFactorData.findMany({
    where: { level: null },
    include: {
      riskFactor: true,
    },
  });

  try {
    const riskData = riskDataPrisma.map((rd) => new RiskFactorDataEntity(rd as any));

    await Promise.all(
      riskData.map(async (rd) => {
        if (!rd?.riskFactor?.severity) return null;
        if (!rd?.probability) return null;
        const matrix = getMatrizRisk(rd.riskFactor.severity, rd.probability);

        await prisma.riskFactorData.update({
          data: { level: matrix.level },
          where: { id: rd.id },
        });
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
