import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

export const removeDuplicatesRisks = async (prisma: PrismaClient) => {
  const x = await prisma.riskFactors.groupBy({
    by: ['name', 'deleted_at'],
    _count: true,
  });

  const names = x.filter((c) => c._count > 1 && c.name != 'Todos' && c.deleted_at == null).map((r) => r.name);

  const risks = await prisma.riskFactors.findMany({
    where: { name: { in: names }, deleted_at: null },
  });

  const map = {};

  risks.forEach((x) => {
    const xx = {
      system: x.system,
      name: x.name,
      id: x.id,
    };

    map[x.name] = [xx, ...(map[x.name] || [])];
  });

  await Promise.all(
    Object.values(map).map(
      async (
        v: {
          system: boolean;
          id: string;
          name: string;
        }[],
      ) => {
        if (v[0].system == true) return await prisma.riskFactors.update({ where: { id: v[1].id }, data: { deleted_at: new Date() } });
        return await prisma.riskFactors.update({ where: { id: v[0].id }, data: { deleted_at: new Date() } });
      },
    ),
  );
};
