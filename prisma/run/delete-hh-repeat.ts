import { PrismaClient } from '@prisma/client';

export const deleteReapeatHH = async (prisma: PrismaClient) => {
  const x = await prisma.hierarchyOnHomogeneous.groupBy({
    by: ['workspaceId', 'homogeneousGroupId', 'hierarchyId', 'endDate', 'startDate'],
    _count: true,
  });

  const toDelete = x.filter((i) => i._count > 1);
  Promise.all(
    toDelete.map(async ({ _count, ...del }) => {
      await prisma.hierarchyOnHomogeneous.deleteMany({
        where: {
          ...del,
        },
      });

      await prisma.hierarchyOnHomogeneous.create({
        data: {
          ...del,
        },
      });
    }),
  );

  // await prisma.examToRiskData.deleteMany({});
  // await prisma.examToRisk.deleteMany({});
  // await prisma.examToClinic.deleteMany({});
  // await prisma.exam.deleteMany({});
};
