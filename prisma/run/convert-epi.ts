import { asyncEach } from './../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

export const convertEpi = async (prisma: PrismaClient) => {
  const riskDta = await prisma.riskFactorData.findMany({
    include: { epis: true },
    where: { epis: { some: { id: { gte: 1 } } } },
  });

  asyncEach(arrayChunks(riskDta, 100), async (chunk) =>
    Promise.all(
      chunk.map(async (riskData) =>
        Promise.all(
          riskData.epis.map(async (epi) =>
            prisma.epiToRiskFactorData.create({
              data: { epiId: epi.id, riskFactorDataId: riskData.id },
            }),
          ),
        ),
      ),
    ),
  );
};
