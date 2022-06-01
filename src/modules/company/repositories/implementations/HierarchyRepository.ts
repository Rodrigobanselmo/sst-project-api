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
  ): Promise<HierarchyEntity[]> {
    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(
        ({
          companyId: _,
          id,
          workspaceIds,
          parentId,
          children,
          ...upsertHierarchy
        }) => {
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
    options: {
      include?: Prisma.HierarchyInclude;
    } = {},
  ) {
    const newOptions = { ...options };

    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId },
      include: {
        hierarchyOnHomogeneous: { include: { homogeneousGroup: true } },
        employees: true,
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
      return new HierarchyEntity(hierarchy);
    });
  }
}
