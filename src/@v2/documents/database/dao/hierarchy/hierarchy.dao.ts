import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HierarchyMapper } from '../../mappers/hierarchy.mapper';
import { IHierarchyDAO } from './hierarchy.types';

@Injectable()
export class HierarchyDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      employees: {
        select: { id: true },
      },
      subOfficeEmployees: {
        select: { id: true },
      },
      hierarchyOnHomogeneous: true,
    } satisfies Prisma.HierarchyFindFirstArgs['include'];

    return { include };
  }

  async findMany(params: IHierarchyDAO.FindByIdParams) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        workspaces: { some: { id: params.workspaceId } },
        ...(params?.homogeneousGroupsIds?.length && {
          OR: [
            {
              OR: [
                {
                  hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                },
                {
                  id: { in: params.homogeneousGroupsIds },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                  },
                },
                {
                  parent: { id: { in: params.homogeneousGroupsIds } },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    parent: {
                      hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                    },
                  },
                },
                {
                  parent: {
                    parent: { id: { in: params.homogeneousGroupsIds } },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    parent: {
                      parent: {
                        hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                      },
                    },
                  },
                },
                {
                  parent: {
                    parent: {
                      parent: { id: { in: params.homogeneousGroupsIds } },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    parent: {
                      parent: {
                        parent: {
                          hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                        },
                      },
                    },
                  },
                },
                {
                  parent: {
                    parent: {
                      parent: {
                        parent: { id: { in: params.homogeneousGroupsIds } },
                      },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    parent: {
                      parent: {
                        parent: {
                          parent: {
                            hierarchyOnHomogeneous: {
                              some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  parent: {
                    parent: {
                      parent: {
                        parent: {
                          parent: { id: { in: params.homogeneousGroupsIds } },
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  children: {
                    some: {
                      hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
                    },
                  },
                },
                {
                  children: {
                    some: { id: { in: params.homogeneousGroupsIds } },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } } },
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
                          id: { in: params.homogeneousGroupsIds },
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          children: {
                            some: {
                              hierarchyOnHomogeneous: {
                                some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } },
                              },
                            },
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
                              id: { in: params.homogeneousGroupsIds },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          children: {
                            some: {
                              children: {
                                some: {
                                  hierarchyOnHomogeneous: {
                                    some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } },
                                  },
                                },
                              },
                            },
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
                                some: {
                                  id: { in: params.homogeneousGroupsIds },
                                },
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
            {
              OR: [
                {
                  children: {
                    some: {
                      children: {
                        some: {
                          children: {
                            some: {
                              children: {
                                some: {
                                  children: {
                                    some: {
                                      hierarchyOnHomogeneous: {
                                        some: { homogeneousGroupId: { in: params.homogeneousGroupsIds } },
                                      },
                                    },
                                  },
                                },
                              },
                            },
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
                                some: {
                                  children: {
                                    some: {
                                      id: { in: params.homogeneousGroupsIds },
                                    },
                                  },
                                },
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
          ],
        }),
      },
      ...HierarchyDAO.selectOptions(),
    });

    return HierarchyMapper.toModels(hierarchies);
  }
}
