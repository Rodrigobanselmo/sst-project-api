import { PrismaClient } from '@prisma/client';

export const fixHierarchyHomo = async (prisma: PrismaClient) => {
  const riskFactorData = await prisma.riskFactorData.findMany({
    where: { homogeneousGroup: { type: 'HIERARCHY', hierarchyOnHomogeneous: { none: { id: { gte: 0 } } } } },
    include: { homogeneousGroup: true },
  });

  Promise.all(
    riskFactorData.map(async (rd) => {
      const hierarchy = await prisma.hierarchy.findFirst({
        where: { id: rd.homogeneousGroupId },
        select: { workspaces: { select: { id: true } } },
      });

      await prisma.hierarchyOnHomogeneous.create({
        data: {
          homogeneousGroupId: rd.homogeneousGroupId,
          hierarchyId: rd.homogeneousGroupId,
          workspaceId: hierarchy?.workspaces?.[0]?.id,
        },
      });
    }),
  );
};
