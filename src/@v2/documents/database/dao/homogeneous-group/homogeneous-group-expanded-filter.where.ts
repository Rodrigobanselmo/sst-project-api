import { Prisma } from '@prisma/client';

export function buildHomogeneousGroupExpandedFilterWhere(
  homogeneousGroupsIds: string[],
): Prisma.HomogeneousGroupWhereInput {
  return {
    OR: [
      {
        id: { in: homogeneousGroupsIds },
      },
      {
        hierarchyOnHomogeneous: {
          some: {
            hierarchy: {
              OR: [
                {
                  id: { in: homogeneousGroupsIds },
                },
                {
                  parent: { id: { in: homogeneousGroupsIds } },
                },
                {
                  parent: { parent: { id: { in: homogeneousGroupsIds } } },
                },
                {
                  parent: { parent: { parent: { id: { in: homogeneousGroupsIds } } } },
                },
                {
                  parent: { parent: { parent: { parent: { id: { in: homogeneousGroupsIds } } } } },
                },
                {
                  parent: {
                    parent: { parent: { parent: { parent: { id: { in: homogeneousGroupsIds } } } } },
                  },
                },
                {
                  children: { some: { id: { in: homogeneousGroupsIds } } },
                },
                {
                  children: { some: { children: { some: { id: { in: homogeneousGroupsIds } } } } },
                },
                {
                  children: {
                    some: {
                      children: { some: { children: { some: { id: { in: homogeneousGroupsIds } } } } },
                    },
                  },
                },
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          children: {
                            some: { children: { some: { id: { in: homogeneousGroupsIds } } } },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          children: {
                            some: {
                              children: {
                                some: { children: { some: { id: { in: homogeneousGroupsIds } } } },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  };
}
