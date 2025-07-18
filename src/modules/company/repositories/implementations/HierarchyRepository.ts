import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HierarchyEnum, Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, FindHierarchyDto, UpdateHierarchyDto, UpdateSimpleManyHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { isEnvironment } from '../../../../shared/utils/isEnvironment';

@Injectable()
export class HierarchyRepository {
  constructor(private prisma: PrismaService) {}

  async upsertMany(
    upsertHierarchyMany: (CreateHierarchyDto & {
      id: string;
      workspaceIds: string[];
    })[],
    companyId: string,
    ghoNames?:
      | Record<string, string>
      | Record<
          string,
          {
            description: string;
            workIds: string[];
          }
        >,
  ): Promise<HierarchyEntity[]> {
    let homogeneousGroup = [];

    //!!!!!!! qual o sentido disso, eu adiciono todos os workspaces da pagina no gse do cargo pq?
    const workIds = upsertHierarchyMany
      .map((h) => h.workspaceIds)
      .filter((i) => i)
      .flat(1)
      .filter((i) => i);

    //create homogenies group
    if (upsertHierarchyMany && upsertHierarchyMany.length > 0)
      homogeneousGroup = ghoNames
        ? await this.prisma.$transaction(
            Object.entries(ghoNames).map(([ghoName, description]) => {
              if (typeof description != 'string') {
                return this.prisma.homogeneousGroup.upsert({
                  create: {
                    company: { connect: { id: companyId } },
                    name: ghoName,
                    description: description.description || '',
                    workspaces: description.workIds.length
                      ? {
                          connect: description.workIds.map((id) => ({
                            id_companyId: { companyId, id },
                          })),
                        }
                      : undefined,
                  },
                  update: {
                    name: ghoName,
                    workspaces: description.workIds.length
                      ? {
                          connect: workIds.map((id) => ({
                            id_companyId: { companyId, id },
                          })),
                        }
                      : undefined,
                    ...(description.description ? { description: description.description } : {}),
                  },
                  where: { name_companyId: { companyId, name: ghoName } },
                });
              }

              return this.prisma.homogeneousGroup.upsert({
                create: {
                  company: { connect: { id: companyId } },
                  name: ghoName,
                  description: description || '',
                  workspaces: workIds.length
                    ? {
                        connect: workIds.map((id) => ({
                          id_companyId: { companyId, id },
                        })),
                      }
                    : undefined,
                },
                update: {
                  name: ghoName,
                  workspaces: workIds.length
                    ? {
                        connect: workIds.map((id) => ({
                          id_companyId: { companyId, id },
                        })),
                      }
                    : undefined,
                  ...(description ? { description: description } : {}),
                },
                where: { name_companyId: { companyId, name: ghoName } },
              });
            }),
          )
        : await this.prisma.$transaction(
            upsertHierarchyMany
              .filter(({ ghoName }) => ghoName)
              .map(({ ghoName, workspaceIds }) => {
                return this.prisma.homogeneousGroup.upsert({
                  create: {
                    company: { connect: { id: companyId } },
                    name: ghoName,
                    description: '',
                    workspaces: workspaceIds.length
                      ? {
                          connect: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                          })),
                        }
                      : undefined,
                  },
                  update: {
                    name: ghoName,
                    workspaces: workspaceIds.length
                      ? {
                          connect: workspaceIds.map((id) => ({
                            id_companyId: { companyId, id },
                          })),
                        }
                      : undefined,
                  },
                  where: { name_companyId: { companyId, name: ghoName } },
                });
              }),
          );

    const HierarchyOnHomoGroup: {
      hierarchyId: string;
      homogeneousGroupId: any;
      endDate: Date;
    }[] = [];
    // const data = await this.prisma.homogeneousGroup.upsert({create:{companyId, name: }});

    const hierarchyOnHomogeneous = {};
    const foundHomogeneousGroups = await this.prisma.hierarchyOnHomogeneous.findMany({
      where: {
        hierarchyId: { in: upsertHierarchyMany.map((h) => h.id) },
        homogeneousGroup: { type: { equals: null } },
      },
    });

    foundHomogeneousGroups.forEach((hh) => {
      const max = foundHomogeneousGroups.reduce((acc, curr) => {
        if (hh.hierarchyId !== curr.hierarchyId) return acc || 0;
        if (hh.homogeneousGroupId !== curr.homogeneousGroupId) return acc || 0;

        return curr?.endDate?.getTime() ? Math.max(acc, curr?.endDate?.getTime()) : acc;
      }, 0);

      hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`] = {};
      hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`].skip = true;

      if ((hh?.endDate?.getTime() || 0) == max) {
        hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`].id = hh.id;
        hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`].skip = false;
      }
    });

    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(({ companyId: _, id, workspaceIds, parentId, children, ghoName, ghoNames, employeesIds, name, ...upsertHierarchy }) => {
        const isSubOffice = upsertHierarchy?.type == HierarchyEnum.SUB_OFFICE;

        const ghos = [];
        if (ghoNames) ghos.push(...ghoNames);
        if (ghoName) ghos.push(ghoName);

        ghos?.forEach((ghoName) => {
          const HierarchyOnHomo = [
            {
              hierarchyId: id,
              homogeneousGroupId: homogeneousGroup.find((homogeneous) => homogeneous.name === ghoName)?.id,
              endDate: null,
            },
          ].filter((hierarchyOnHomo) => hierarchyOnHomo.homogeneousGroupId);

          HierarchyOnHomoGroup.push(...HierarchyOnHomo);
        });

        return this.prisma.hierarchy.upsert({
          create: {
            ...upsertHierarchy,
            name: name.split('//')[0],
            id,
            company: { connect: { id: companyId } },
            [isSubOffice ? 'subOfficeEmployees' : 'employees']:
              employeesIds && employeesIds.length
                ? {
                    connect: employeesIds.map((id) => ({
                      id_companyId: { companyId, id },
                    })),
                  }
                : undefined,
            workspaces: workspaceIds
              ? {
                  connect: workspaceIds.map((id) => ({
                    id_companyId: { companyId, id },
                  })),
                }
              : undefined,
            parent: parentId
              ? {
                  connect: { id: parentId },
                }
              : undefined,
          },
          update: {
            ...upsertHierarchy,
            name: name.split('//')[0],
            workspaces: !(workspaceIds && workspaceIds.length > 0)
              ? undefined
              : {
                  set: workspaceIds.map((id) => ({
                    id_companyId: { companyId, id },
                  })),
                },
            [isSubOffice ? 'subOfficeEmployees' : 'employees']:
              employeesIds && employeesIds.length
                ? {
                    connect: employeesIds.map((id) => ({
                      id_companyId: { companyId, id },
                    })),
                  }
                : undefined,
            parent: !parentId
              ? parentId === null
                ? { disconnect: true }
                : undefined
              : {
                  connect: { id: parentId },
                },
          },
          where: { id: id || 'none' },
          // ...(parentId && { where: { parentId_name: { parentId, name: name.split('//')[0] } } }),
          include: { workspaces: true },
        });
      }),
    );
    await this.prisma.$transaction(
      HierarchyOnHomoGroup.filter((hh) => {
        if (hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`]) {
          if (hierarchyOnHomogeneous[`${hh.hierarchyId}${hh.homogeneousGroupId}`].skip) return false;
        }
        return true;
      }).map((hierarchyOnHomoGroup) => {
        return this.prisma.hierarchyOnHomogeneous.upsert({
          create: {
            ...hierarchyOnHomoGroup,
            startDate: null,
          },
          update: { endDate: null },
          where: {
            id: hierarchyOnHomogeneous[`${hierarchyOnHomoGroup.hierarchyId}${hierarchyOnHomoGroup.homogeneousGroupId}`]?.id || 0,
          },
        });
      }),
    );

    return data.map((hierarchy) => new HierarchyEntity(hierarchy));
  }

  async updateSimpleMany(
    upsertHierarchyMany: (UpdateSimpleManyHierarchyDto & {
      id: string;
    })[],
    companyId: string,
  ): Promise<HierarchyEntity[]> {
    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(({ id, ...upsertHierarchy }) => {
        return this.prisma.hierarchy.update({
          data: {
            ...upsertHierarchy,
            companyId,
            id,
          },
          where: { id: id || 'none' },
        });
      }),
    );

    return data.map((hierarchy) => new HierarchyEntity(hierarchy));
  }

  async update({ companyId: _, workspaceIds, parentId, id, children, name, employeesIds, ...updateHierarchy }: UpdateHierarchyDto, companyId: string): Promise<HierarchyEntity> {
    const isSubOffice = updateHierarchy?.type == HierarchyEnum.SUB_OFFICE;

    try {
      if (workspaceIds.length)
        this.prisma.homogeneousGroup.update({
          data: {
            workspaces: workspaceIds.length
              ? {
                  set: workspaceIds.map((id) => ({
                    id_companyId: { companyId, id },
                  })),
                }
              : undefined,
          },
          where: { id },
        });
    } catch (error) {}

    const data = await this.prisma.hierarchy.update({
      where: { id },
      data: {
        ...updateHierarchy,
        name: name.split('//')[0],
        workspaces: !workspaceIds
          ? undefined
          : {
              set: workspaceIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            },
        [isSubOffice ? 'subOfficeEmployees' : 'employees']:
          employeesIds && employeesIds.length
            ? {
                connect: employeesIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              }
            : undefined,
        parent: !parentId
          ? undefined
          : {
              connect: {
                id: parentId,
              },
            },
      },
    });

    return new HierarchyEntity(data);
  }

  async upsert({ companyId: _, id, workspaceIds, parentId, children, name, employeesIds, ...upsertHierarchy }: CreateHierarchyDto & { id?: string }, companyId: string): Promise<HierarchyEntity> {
    const isSubOffice = upsertHierarchy?.type == HierarchyEnum.SUB_OFFICE;

    try {
      if (workspaceIds.length && !!id)
        this.prisma.homogeneousGroup.update({
          data: {
            workspaces: workspaceIds.length
              ? {
                  set: workspaceIds.map((id) => ({
                    id_companyId: { companyId, id },
                  })),
                }
              : undefined,
          },
          where: { id },
        });
    } catch (error) {}

    const data = await this.prisma.hierarchy.upsert({
      create: {
        ...upsertHierarchy,
        id,
        name: name.split('//')[0],
        company: { connect: { id: companyId } },
        workspaces: {
          connect: workspaceIds.map((id) => ({
            id_companyId: { companyId, id },
          })),
        },
        [isSubOffice ? 'subOfficeEmployees' : 'employees']:
          employeesIds && employeesIds.length
            ? {
                connect: employeesIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              }
            : undefined,
        parent: parentId
          ? {
              connect: { id: parentId },
            }
          : undefined,
      },
      update: {
        ...upsertHierarchy,
        name: name.split('//')[0],
        [isSubOffice ? 'subOfficeEmployees' : 'employees']:
          employeesIds && employeesIds.length
            ? {
                set: employeesIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              }
            : undefined,
        workspaces: !workspaceIds
          ? undefined
          : {
              set: workspaceIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            },
        parent: !parentId
          ? undefined
          : {
              connect: { id: parentId },
            },
      },
      where: { id: id || 'none' },
    });

    return new HierarchyEntity(data);
  }

  async upsertSubOffice({
    companyId,
    id,
    workspaceIds,
    parentId,
    name,
    employeesIds,
    historyIds,
    ...upsertHierarchy
  }: Omit<CreateHierarchyDto, 'children' | 'ghoName'> & {
    id?: string;
    historyIds?: number[];
  }): Promise<HierarchyEntity> {
    try {
      if (workspaceIds.length)
        this.prisma.homogeneousGroup.update({
          data: {
            workspaces: workspaceIds.length
              ? {
                  set: workspaceIds.map((id) => ({
                    id_companyId: { companyId, id },
                  })),
                }
              : undefined,
          },
          where: { id },
        });
    } catch (error) {}

    const data = await this.prisma.hierarchy.upsert({
      create: {
        ...upsertHierarchy,
        id,
        name: name.split('//')[0],
        company: { connect: { id: companyId } },
        workspaces: {
          connect: workspaceIds.map((id) => ({
            id_companyId: { companyId, id },
          })),
        },
        ...(employeesIds &&
          !!employeesIds.length && {
            subOfficeEmployees: {
              connect: employeesIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            },
            ...(historyIds &&
              !!historyIds.length && {
                subHierarchyHistory: {
                  connect: historyIds.map((id) => ({
                    id,
                  })),
                },
              }),
          }),
        parent: {
          connect: { id: parentId },
        },
      },
      update: {
        ...upsertHierarchy,
        name: name.split('//')[0],
        ...(historyIds &&
          !!historyIds.length && {
            subHierarchyHistory: {
              connect: historyIds.map((id) => ({
                id,
              })),
            },
          }),
        subOfficeEmployees:
          employeesIds && !!employeesIds.length
            ? {
                connect: employeesIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              }
            : undefined,
        workspaces: !workspaceIds
          ? undefined
          : {
              set: workspaceIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            },
        parent: !parentId
          ? undefined
          : {
              connect: { id: parentId },
            },
      },
      where: { id: id || 'none' },
      include: { workspaces: true, subOfficeEmployees: { select: { id: true } } },
    });

    return new HierarchyEntity(data as any);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.hierarchy.delete({
      where: { id: id || 'none' },
    });
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await this.prisma.hierarchy.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async findAllHierarchyByCompanyAndId(id: string, companyId: string, options: Prisma.HierarchyFindFirstArgs = {}) {
    const hierarchy = await this.prisma.hierarchy.findFirst({
      where: { companyId, id, ...options.where },
      ...options,
      ...(!options.select && { include: { workspaces: { select: { id: true } } } }),
    });

    return new HierarchyEntity(hierarchy as any);
  }

  async findAllHierarchyByCompany(
    companyId: string,
    {
      returnWorkspace,
      ...options
    }: {
      include?: Prisma.HierarchyInclude;
      returnWorkspace?: boolean;
    } = {},
  ) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId },
      ...options,
    });

    return hierarchies.map((hierarchy) => {
      if ((hierarchy as any)?.workspaces) {
        (hierarchy as any).workspaceIds = (hierarchy as any)?.workspaces.map((workspace) => workspace.id);

        if (!returnWorkspace) delete (hierarchy as any).workspaces;
      }

      if ('hierarchyOnHomogeneous' in hierarchy) {
        const homogeneousGroup = { ...hierarchy } as HierarchyEntity;
        if ((hierarchy as any).hierarchyOnHomogeneous)
          homogeneousGroup.homogeneousGroups = (hierarchy as any).hierarchyOnHomogeneous.map((homo) => ({
            ...homo.homogeneousGroup,
            workspaceId: homo.workspaceId,
            environment: homo.homogeneousGroup?.characterization && isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
            characterization: homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
          }));
        return new HierarchyEntity(homogeneousGroup);
      }

      return new HierarchyEntity(hierarchy);
    });
  }

  async findAllDataHierarchyByCompany(
    companyId: string,
    workspaceId: string,
    options: {
      include?: Prisma.HierarchyInclude;
    } = {},
  ) {
    const newOptions = { ...options };

    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId, workspaces: { some: { id: workspaceId } } },
      include: {
        hierarchyOnHomogeneous: {
          include: {
            homogeneousGroup: {
              include: { characterization: true },
            },
          },
          where: { endDate: null },
        },
        subOfficeEmployees: {
          // where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
          include: { subOffices: true },
        },
        employees: true,
        // employees: {
        //   where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
        // },
        workspaces: true,
      },
    });

    return hierarchies.map((hierarchy) => {
      const hierarchyCopy = { ...hierarchy } as HierarchyEntity;

      if (hierarchy.hierarchyOnHomogeneous)
        hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map((homo) => ({
          ...homo.homogeneousGroup,
          characterization: homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
          environment: homo.homogeneousGroup?.characterization && isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
        }));

      return new HierarchyEntity(hierarchyCopy);
    });
  }

  // async findESocialHierarchies(
  //   companyId: string,
  //   options: {
  //     include?: Prisma.HierarchyInclude;
  //   } = {},
  // ) {
  //   const newOptions = { ...options };

  //   const hierarchies = await this.prisma.hierarchy.findMany({
  //     where: { companyId },
  //     select: {
  //       description: true,
  //       parentId: true,
  //       riskDocInfo: { select: { isPPP: true } },
  //       hierarchyOnHomogeneous: true,
  //       subOfficeEmployees: {
  //         select:{}
  //         include: { subOffices: true },
  //       },
  //       employees: {
  //         select: { id: true, cpf: true },
  //       },
  //     },
  //   });

  //   return hierarchies.map((hierarchy) => {
  //     const hierarchyCopy = { ...hierarchy } as HierarchyEntity;

  //     if (hierarchy.hierarchyOnHomogeneous)
  //       hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map(
  //         (homo) => ({
  //           ...homo.homogeneousGroup,
  //           workspaceId: homo.workspaceId,
  //           characterization:
  //             homo.homogeneousGroup?.characterization &&
  //             !isEnvironment(homo.homogeneousGroup.characterization.type)
  //               ? homo.homogeneousGroup.characterization
  //               : undefined,
  //           environment:
  //             homo.homogeneousGroup?.characterization &&
  //             isEnvironment(homo.homogeneousGroup.characterization.type)
  //               ? homo.homogeneousGroup.characterization
  //               : undefined,
  //         }),
  //       );
  //     return new HierarchyEntity(hierarchyCopy);
  //   });
  // }

  async findById(id: string, companyId: string) {
    const hierarchiesIds: string[] = [];
    const AllChildrenHierarchies = (await this.prisma.hierarchy.findFirst({
      where: { id: { equals: id } },
      include: {
        workspaces: true,
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: {
                      include: {
                        children: {
                          include: { children: true },
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
    })) as HierarchyEntity;

    const getAllHierarchiesChildren = (hierarchies: HierarchyEntity[]) => {
      hierarchies.forEach((hierarchy) => {
        hierarchiesIds.push(hierarchy.id);

        if (hierarchy.children) getAllHierarchiesChildren(hierarchy.children);
      });
    };

    getAllHierarchiesChildren([AllChildrenHierarchies]);

    AllChildrenHierarchies.employeesCount = await this.prisma.employee.count({
      where: {
        companyId,
        hierarchyId: {
          in: hierarchiesIds,
        },
      },
    });

    delete AllChildrenHierarchies.children;

    return new HierarchyEntity(AllChildrenHierarchies);
  }

  async findByIdWithParent(id: string, companyId: string) {
    const hierarchies = (await this.prisma.hierarchy.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        workspaces: true,
        parent: {
          include: {
            parent: {
              include: {
                parent: {
                  include: {
                    parent: {
                      include: {
                        parent: {
                          include: { parent: true },
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
    })) as HierarchyEntity;

    return new HierarchyEntity(hierarchies);
  }

  async find(query: Partial<FindHierarchyDto>, pagination: PaginationQueryDto, options: Prisma.HierarchyFindManyArgs = {}) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    options.orderBy = {
      name: 'asc',
    };

    options.select = {
      id: true,
      name: true,
      companyId: true,
      parentId: true,
      type: true,
      ...options?.select,
    };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'homogeneousGroupId'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('homogeneousGroupId' in query) {
      (where.AND as any).push({
        hierarchyOnHomogeneous: {
          some: { homogeneousGroupId: query.homogeneousGroupId },
        },
      } as typeof options.where);

      options.select.hierarchyOnHomogeneous = {
        where: { homogeneousGroupId: query.homogeneousGroupId },
      };
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.hierarchy.count({
        where,
      }),
      this.prisma.hierarchy.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
      }),
    ]);

    return {
      data: response[1].map((hierarchy) => new HierarchyEntity(hierarchy)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.HierarchyFindManyArgs = {}) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      ...options,
    });

    return hierarchies.map((hierarchy) => new HierarchyEntity(hierarchy));
  }

  async findFirstNude(options: Prisma.HierarchyFindFirstArgs = {}) {
    const data = await this.prisma.hierarchy.findFirst({
      ...options,
    });

    return new HierarchyEntity(data);
  }

  async findDocumentData(
    companyId: string,
    options: {
      workspaceId?: string;
      ghoIds?: string[];
    } = {},
  ) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        companyId,
        ...(options.workspaceId && { workspaces: { some: { id: options.workspaceId } } }),
        ...(options?.ghoIds?.length && {
          OR: [
            {
              OR: [
                {
                  hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
                },
                {
                  id: { in: options.ghoIds },
                },
              ],
            },
            {
              OR: [
                {
                  parent: {
                    hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
                  },
                },
                {
                  parent: {
                    id: { in: options.ghoIds },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  children: {
                    some: {
                      hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
                    },
                  },
                },
                {
                  children: {
                    some: {
                      id: { in: options.ghoIds },
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
                          hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
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
                          id: { in: options.ghoIds },
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
                              hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
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
                              id: { in: options.ghoIds },
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
                                  hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: options.ghoIds } } },
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
                                  id: { in: options.ghoIds },
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
      include: {
        hierarchyOnHomogeneous: {
          where: { endDate: null },
        },
        subOfficeEmployees: {
          include: { subOffices: true },
        },
        employees: { select: { id: true, sex: true, hierarchyId: true } },
        workspaces: { select: { id: true, name: true } },
      },
    });

    return hierarchies.map((hierarchy) => {
      return new HierarchyEntity(hierarchy as any);
    });
  }
}
