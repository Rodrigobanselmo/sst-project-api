import { describe, expect, it, jest } from '@jest/globals';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { resolveHomogeneousGroupFilterMode } from './resolve-homogeneous-group-filter-mode.util';

describe('resolveHomogeneousGroupFilterMode', () => {
  const workspaceId = 'workspace-1';

  const createPrismaMock = ({
    hierarchyCount = 0,
    groups = [] as { id: string; type: HomoTypeEnum | null }[],
  }) => {
    const prisma = {
      hierarchy: {
        count: jest.fn<() => Promise<number>>().mockResolvedValue(hierarchyCount),
      },
      homogeneousGroup: {
        findMany: jest
          .fn<() => Promise<{ id: string; type: HomoTypeEnum | null }[]>>()
          .mockResolvedValue(groups),
      },
    };

    return prisma as any;
  };

  it('returns strict for environment homogeneous group ids', async () => {
    const prisma = createPrismaMock({
      groups: [
        { id: 'env-1', type: HomoTypeEnum.ENVIRONMENT },
        { id: 'env-2', type: HomoTypeEnum.ENVIRONMENT },
      ],
    });

    await expect(
      resolveHomogeneousGroupFilterMode(prisma, {
        workspaceId,
        homogeneousGroupsIds: ['env-1', 'env-2'],
      }),
    ).resolves.toBe('strict');
  });

  it('returns expanded when ids match hierarchy nodes (cargo filter)', async () => {
    const prisma = createPrismaMock({
      hierarchyCount: 1,
      groups: [{ id: 'office-1', type: HomoTypeEnum.HIERARCHY }],
    });

    await expect(
      resolveHomogeneousGroupFilterMode(prisma, {
        workspaceId,
        homogeneousGroupsIds: ['office-1'],
      }),
    ).resolves.toBe('expanded');
  });

  it('returns expanded when a homogeneous group is hierarchy type', async () => {
    const prisma = createPrismaMock({
      groups: [{ id: 'office-1', type: HomoTypeEnum.HIERARCHY }],
    });

    await expect(
      resolveHomogeneousGroupFilterMode(prisma, {
        workspaceId,
        homogeneousGroupsIds: ['office-1'],
      }),
    ).resolves.toBe('expanded');
  });
});
