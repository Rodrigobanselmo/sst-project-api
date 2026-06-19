import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';

export type HomogeneousGroupFilterMode = 'strict' | 'expanded';

export async function resolveHomogeneousGroupFilterMode(
  prisma: PrismaServiceV2,
  params: { workspaceId: string; homogeneousGroupsIds: string[] },
): Promise<HomogeneousGroupFilterMode> {
  const { workspaceId, homogeneousGroupsIds } = params;

  if (!homogeneousGroupsIds.length) {
    return 'strict';
  }

  const [matchingHierarchiesCount, selectedGroups] = await Promise.all([
    prisma.hierarchy.count({
      where: {
        id: { in: homogeneousGroupsIds },
        workspaces: { some: { id: workspaceId } },
        status: 'ACTIVE',
      },
    }),
    prisma.homogeneousGroup.findMany({
      where: {
        id: { in: homogeneousGroupsIds },
        workspaces: { some: { id: workspaceId } },
        status: 'ACTIVE',
      },
      select: { id: true, type: true },
    }),
  ]);

  if (matchingHierarchiesCount > 0) {
    return 'expanded';
  }

  if (selectedGroups.some((group) => group.type === HomoTypeEnum.HIERARCHY)) {
    return 'expanded';
  }

  if (selectedGroups.length === homogeneousGroupsIds.length) {
    return 'strict';
  }

  return 'expanded';
}
