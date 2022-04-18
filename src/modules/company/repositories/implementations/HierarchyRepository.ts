/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

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
          workplaceId,
          parentId,
          children,
          ...upsertHierarchy
        }) => {
          return this.prisma.hierarchy.upsert({
            create: {
              ...upsertHierarchy,
              id,
              company: { connect: { id: companyId } },
              workplace: {
                connect: { id_companyId: { companyId, id: workplaceId } },
              },
              parent: parentId
                ? {
                    connect: { id: parentId },
                  }
                : undefined,
            },
            update: {
              ...upsertHierarchy,
              workplace: !workplaceId
                ? undefined
                : {
                    connect: { id_companyId: { companyId, id: workplaceId } },
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
      workplaceId,
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
        workplace: !workplaceId
          ? undefined
          : {
              connect: {
                id_companyId: { companyId, id: workplaceId },
              },
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
      workplaceId,
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
        workplace: {
          connect: { id_companyId: { companyId, id: workplaceId } },
        },
        parent: parentId
          ? {
              connect: { id: parentId },
            }
          : undefined,
      },
      update: {
        ...upsertHierarchy,
        workplace: !workplaceId
          ? undefined
          : {
              connect: { id_companyId: { companyId, id: workplaceId } },
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

  async findAllHierarchyByCompany(companyId: string) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId },
    });

    return hierarchies.map((hierarchy) => new HierarchyEntity(hierarchy));
  }
}
