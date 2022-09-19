import { getMatrizRisk } from '../../src/shared/utils/matriz';
import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

export const levelRiskData = async (prisma: PrismaClient) => {
  const riskData = await prisma.riskFactorData.findMany({
    where: { level: null },
    select: { level: true, id: true, probability: true, riskFactor: true },
  });

  await Promise.all(
    riskData.map(async (rd) => {
      if (!rd.riskFactor.severity) return null;
      const matrix = getMatrizRisk(rd.riskFactor.severity, rd.probability);

      await prisma.riskFactorData.update({
        data: { level: matrix.level },
        where: { id: rd.id },
      });
    }),
  );
};
