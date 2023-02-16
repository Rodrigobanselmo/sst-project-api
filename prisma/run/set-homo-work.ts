import { asyncBatch } from '../../src/shared/utils/asyncBatch';
import { PrismaClient } from '@prisma/client';

export const setHomoWork = async (prisma: PrismaClient) => {
  const company = await prisma.company.findMany({ select: { id: true, homogeneousGroup: { select: { id: true } }, workspace: { select: { id: true } } } });

  await asyncBatch(company, 10, async (company) => {
    await Promise.all(
      company.homogeneousGroup.map(async ({ id }) => {
        await prisma.homogeneousGroup.update({
          data: { workspaces: { connect: company.workspace.map((w) => ({ id: w.id })) } },
          where: { id },
        });
      }),
    );
  });
};
