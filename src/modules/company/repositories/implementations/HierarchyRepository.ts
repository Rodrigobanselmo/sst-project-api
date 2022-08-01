/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HierarchyEnum, Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateHierarchyDto,
  UpdateHierarchyDto,
  UpdateSimpleManyHierarchyDto,
} from '../../dto/hierarchy';
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
    }[] = [];
    // const data = await this.prisma.homogeneousGroup.upsert({create:{companyId, name: }});

    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(
        ({
          companyId: _,
          id,
          workspaceIds,
          parentId,
          children,
          ghoName,
          employeesIds,
          name,
          ...upsertHierarchy
        }) => {
          const isSubOffice = upsertHierarchy?.type == HierarchyEnum.SUB_OFFICE;
          const HierarchyOnHomo = !workspaceIds
            ? []
            : workspaceIds
                .map((workspaceId) => ({
                  hierarchyId: id,
                  homogeneousGroupId: homogeneousGroup.find(
                    (homogeneous) => homogeneous.name === ghoName,
                  )?.id,
                  workspaceId,
                }))
                .filter(
                  (hierarchyOnHomo) => hierarchyOnHomo.homogeneousGroupId,
                );

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
        },
      ),
    );

    await this.prisma.$transaction(
      HierarchyOnHomoGroup.map((hierarchyOnHomoGroup) => {
        return this.prisma.hierarchyOnHomogeneous.upsert({
          create: {
            ...hierarchyOnHomoGroup,
          },
          update: {},
          where: {
            hierarchyId_homogeneousGroupId_workspaceId: hierarchyOnHomoGroup,
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
    {
      companyId: _,
      workspaceIds,
      parentId,
      id,
      children,
      name,
      employeesIds,
      ...updateHierarchy
    }: UpdateHierarchyDto,
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
    {
      companyId: _,
      id,
      workspaceIds,
      parentId,
      children,
      name,
      employeesIds,
      ...upsertHierarchy
    }: CreateHierarchyDto & { id?: string },
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
    ...upsertHierarchy
  }: Omit<CreateHierarchyDto, 'children' | 'ghoName'> & {
    id?: string;
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
        subOfficeEmployees:
          employeesIds && employeesIds.length
            ? {
                connect: employeesIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              }
            : undefined,
        parent: {
          connect: { id: parentId },
        },
      },
      update: {
        ...upsertHierarchy,
        name: name.split('//')[0],
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
    });

    return new HierarchyEntity(hierarchy);
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
        (hierarchy as any).workspaceIds = (hierarchy as any)?.workspaces.map(
          (workspace) => workspace.id,
        );

        if (!returnWorkspace) delete (hierarchy as any).workspaces;
      }

      if ('hierarchyOnHomogeneous' in hierarchy) {
        const homogeneousGroup = { ...hierarchy } as HierarchyEntity;
        if ((hierarchy as any).hierarchyOnHomogeneous)
          homogeneousGroup.homogeneousGroups = (
            hierarchy as any
          ).hierarchyOnHomogeneous.map((homo) => ({
            ...homo.homogeneousGroup,
            workspaceId: homo.workspaceId,
            environment:
              homo.homogeneousGroup?.characterization &&
              isEnvironment(homo.homogeneousGroup.characterization.type)
                ? homo.homogeneousGroup.characterization
                : undefined,
            characterization:
              homo.homogeneousGroup?.characterization &&
              !isEnvironment(homo.homogeneousGroup.characterization.type)
                ? homo.homogeneousGroup.characterization
                : undefined,
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
        },
        employees: { where: { workspaces: { some: { id: workspaceId } } } },
        workspaces: true,
      },
    });

    return hierarchies.map((hierarchy) => {
      const hierarchyCopy = { ...hierarchy } as HierarchyEntity;

      if (hierarchy.hierarchyOnHomogeneous)
        hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map(
          (homo) => ({
            ...homo.homogeneousGroup,
            workspaceId: homo.workspaceId,
            characterization:
              homo.homogeneousGroup?.characterization &&
              !isEnvironment(homo.homogeneousGroup.characterization.type)
                ? homo.homogeneousGroup.characterization
                : undefined,
            environment:
              homo.homogeneousGroup?.characterization &&
              isEnvironment(homo.homogeneousGroup.characterization.type)
                ? homo.homogeneousGroup.characterization
                : undefined,
          }),
        );
      return new HierarchyEntity(hierarchyCopy);
    });
  }

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
}
