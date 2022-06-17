/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, UpdateHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';

@Injectable()
export class HierarchyRepository {
  constructor(private prisma: PrismaService) {}

  async upsertMany(
    upsertHierarchyMany: (CreateHierarchyDto & { id: string })[],
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
          ...upsertHierarchy
        }) => {
          const HierarchyOnHomo = workspaceIds
            .map((workspaceId) => ({
              hierarchyId: id,
              homogeneousGroupId: homogeneousGroup.find(
                (homogeneous) => homogeneous.name === ghoName,
              )?.id,
              workspaceId,
            }))
            .filter((hierarchyOnHomo) => hierarchyOnHomo.homogeneousGroupId);

          HierarchyOnHomoGroup.push(...HierarchyOnHomo);

          return this.prisma.hierarchy.upsert({
            create: {
              ...upsertHierarchy,
              id,
              company: { connect: { id: companyId } },
              workspaces: {
                connect: workspaceIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              },
              parent: parentId
                ? {
                    connect: { id: parentId },
                  }
                : undefined,
            },
            update: {
              ...upsertHierarchy,
              workspaces: !workspaceIds
                ? undefined
                : {
                    set: workspaceIds.map((id) => ({
                      id_companyId: { companyId, id },
                    })),
                  },
              parent: !parentId
                ? parentId === null
                  ? { disconnect: true }
                  : undefined
                : {
                    connect: { id: parentId },
                  },
            },
            where: { id: id || 'none' },
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

  async update(
    {
      companyId: _,
      workspaceIds,
      parentId,
      id,
      children,
      ...updateHierarchy
    }: UpdateHierarchyDto,
    companyId: string,
  ): Promise<HierarchyEntity> {
    const data = await this.prisma.hierarchy.update({
      where: { id },
      data: {
        ...updateHierarchy,
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
      ...upsertHierarchy
    }: CreateHierarchyDto & { id?: string },
    companyId: string,
  ): Promise<HierarchyEntity> {
    const data = await this.prisma.hierarchy.upsert({
      create: {
        ...upsertHierarchy,
        id,
        company: { connect: { id: companyId } },
        workspaces: {
          connect: workspaceIds.map((id) => ({
            id_companyId: { companyId, id },
          })),
        },
        parent: parentId
          ? {
              connect: { id: parentId },
            }
          : undefined,
      },
      update: {
        ...upsertHierarchy,
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
    options: {
      include?: Prisma.HierarchyInclude;
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

        delete (hierarchy as any).workspaces;
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
        hierarchyOnHomogeneous: { include: { homogeneousGroup: true } },
        employees: { where: { workspaces: { some: { id: workspaceId } } } },
        workspaces: true,
      },
    });

    return hierarchies.map((hierarchy) => {
      const homogeneousGroup = { ...hierarchy } as HierarchyEntity;
      if (hierarchy.hierarchyOnHomogeneous)
        homogeneousGroup.homogeneousGroups =
          hierarchy.hierarchyOnHomogeneous.map((homo) => ({
            ...homo.homogeneousGroup,
            workspaceId: homo.workspaceId,
          }));
      return new HierarchyEntity(homogeneousGroup);
    });
  }
}
