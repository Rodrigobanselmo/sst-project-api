import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HierarchyEnum, Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, FindHierarchyDto, UpdateHierarchyDto, UpdateSimpleManyHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { isEnvironment } from './CharacterizationRepository';

@Injectable()
export class HierarchyRepository {
  constructor(private prisma: PrismaService) {}

  async upsertMany(
    upsertHierarchyMany: (CreateHierarchyDto & {
      id: string;
      workspaceIds: string[];
    })[],
    companyId: string,
    ghoNames?: Record<string, string>,
  ): Promise<HierarchyEntity[]> {
    let homogeneousGroup = [];
    //create homogenies group
    if (upsertHierarchyMany && upsertHierarchyMany.length > 0)
      homogeneousGroup = ghoNames
        ? await this.prisma.$transaction(
            Object.entries(ghoNames).map(([ghoName, description]) => {
              return this.prisma.homogeneousGroup.upsert({
                create: {
                  company: { connect: { id: companyId } },
                  name: ghoName,
                  description: description || '',
                },
                update: {
                  name: ghoName,
                  ...(description ? { description: description } : {}),
                },
                where: { name_companyId: { companyId, name: ghoName } },
              });
            }),
          )
        : await this.prisma.$transaction(
            upsertHierarchyMany
              .filter(({ ghoName }) => ghoName)
              .map(({ ghoName }) => {
                return this.prisma.homogeneousGroup.upsert({
                  create: {
                    company: { connect: { id: companyId } },
                    name: ghoName,
                    description: '',
                  },
                  update: {
                    name: ghoName,
                  },
                  where: { name_companyId: { companyId, name: ghoName } },
                });
              }),
          );

    const HierarchyOnHomoGroup: {
      hierarchyId: string;
      homogeneousGroupId: any;
      workspaceId: string;
      endDate: Date;
    }[] = [];
    // const data = await this.prisma.homogeneousGroup.upsert({create:{companyId, name: }});

    const hierarchyOnHomogeneous = {};
    const foundHomogeneousGroups = await this.prisma.hierarchyOnHomogeneous.findMany({
      where: {
        hierarchyId: { in: upsertHierarchyMany.map((h) => h.id) },
      },
    });

    foundHomogeneousGroups.forEach((hg) => {
      const max = foundHomogeneousGroups.reduce((a, b) => {
        if (hg.hierarchyId !== b.hierarchyId) return a;
        return Math.max(a, b?.endDate?.getTime());
      }, 0);

      if ((hg?.endDate?.getTime() || 0) == max) {
        hierarchyOnHomogeneous[hg.hierarchyId] = {};
        hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;
      }
    });

    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(({ companyId: _, id, workspaceIds, parentId, children, ghoName, employeesIds, name, ...upsertHierarchy }) => {
        const isSubOffice = upsertHierarchy?.type == HierarchyEnum.SUB_OFFICE;
        const HierarchyOnHomo = !workspaceIds
          ? []
          : workspaceIds
              .map((workspaceId) => ({
                hierarchyId: id,
                homogeneousGroupId: homogeneousGroup.find((homogeneous) => homogeneous.name === ghoName)?.id,
                workspaceId,
                endDate: null,
              }))
              .filter((hierarchyOnHomo) => hierarchyOnHomo.homogeneousGroupId);

        HierarchyOnHomoGroup.push(...HierarchyOnHomo);

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
          include: { workspaces: true },
        });
      }),
    );

    await this.prisma.$transaction(
      HierarchyOnHomoGroup.map((hierarchyOnHomoGroup) => {
        return this.prisma.hierarchyOnHomogeneous.upsert({
          create: {
            ...hierarchyOnHomoGroup,
            startDate: null,
          },
          update: { endDate: null },
          where: {
            id: hierarchyOnHomogeneous[hierarchyOnHomoGroup.hierarchyId]?.id || 0,
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

  async update(
    { companyId: _, workspaceIds, parentId, id, children, name, employeesIds, ...updateHierarchy }: UpdateHierarchyDto,
    companyId: string,
  ): Promise<HierarchyEntity> {
    const isSubOffice = updateHierarchy?.type == HierarchyEnum.SUB_OFFICE;

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

  async upsert(
    { companyId: _, id, workspaceIds, parentId, children, name, employeesIds, ...upsertHierarchy }: CreateHierarchyDto & { id?: string },
    companyId: string,
  ): Promise<HierarchyEntity> {
    const isSubOffice = upsertHierarchy?.type == HierarchyEnum.SUB_OFFICE;

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
          employeesIds.length && {
            subOfficeEmployees: {
              connect: employeesIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            },
            ...(historyIds &&
              historyIds.length && {
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
        employeeExamsHistorySubOffice: {
          connect: historyIds.map((id) => ({
            id,
          })),
        },
        subOfficeEmployees:
          employeesIds && employeesIds.length
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
      include: { workspaces: true },
    });

    return new HierarchyEntity(data);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.hierarchy.delete({
      where: { id: id || 'none' },
    });
  }

  async findAllHierarchyByCompanyAndId(id: string, companyId: string) {
    const hierarchy = await this.prisma.hierarchy.findFirst({
      where: { companyId, id },
      include: { workspaces: { select: { id: true } } },
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
            environment:
              homo.homogeneousGroup?.characterization && isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
            characterization:
              homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
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
              include: { characterization: true, environment: true },
            },
          },
          where: { endDate: null },
        },
        subOfficeEmployees: {
          where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
          include: { subOffices: true },
        },
        employees: {
          where: { hierarchy: { workspaces: { some: { id: workspaceId } } } },
        },
        workspaces: true,
      },
    });

    return hierarchies.map((hierarchy) => {
      const hierarchyCopy = { ...hierarchy } as HierarchyEntity;

      if (hierarchy.hierarchyOnHomogeneous)
        hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map((homo) => ({
          ...homo.homogeneousGroup,
          workspaceId: homo.workspaceId,
          characterization:
            homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
          environment:
            homo.homogeneousGroup?.characterization && isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
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

    if ('search' in query) {
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

  async findFirstNude(options: Prisma.HierarchyFindFirstArgs = {}) {
    const data = await this.prisma.hierarchy.findFirst({
      ...options,
    });

    return new HierarchyEntity(data);
  }
}
