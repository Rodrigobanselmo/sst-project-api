/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import { asyncEach } from '../../../../shared/utils/asyncEach';
import { CreateHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class HomoGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    { ...createHomoGroupDto }: CreateHomoGroupDto,
    companyId: string,
  ): Promise<HomoGroupEntity> {
    const data = await this.prisma.homogeneousGroup.create({
      data: {
        ...createHomoGroupDto,
        companyId,
      },
    });

    return this.getHomoGroupData(data);
  }

  async update({
    id,
    hierarchies,
    ...updateHomoGroup
  }: UpdateHomoGroupDto): Promise<HomoGroupEntity> {
    let homoHierarchies = [];
    if (hierarchies) {
      homoHierarchies = hierarchies.map((hierarchy) => ({
        hierarchyId_homogeneousGroupId_workspaceId: {
          hierarchyId: hierarchy.id,
          homogeneousGroupId: id,
          workspaceId: hierarchy.workspaceId,
        },
      }));

      await this.prisma.hierarchyOnHomogeneous.deleteMany({
        where: { homogeneousGroupId: id },
      });

      const addHomoHierarchies = async (value: typeof homoHierarchies[0]) => {
        await this.prisma.hierarchyOnHomogeneous.upsert({
          create: { ...value.hierarchyId_homogeneousGroupId_workspaceId },
          update: {},
          where: value,
        });
      };

      await asyncEach(homoHierarchies, addHomoHierarchies);
    }

    const data = await this.prisma.homogeneousGroup.update({
      where: { id },
      include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
      data: {
        ...updateHomoGroup,
        hierarchyOnHomogeneous: homoHierarchies.length
          ? {
              set: homoHierarchies,
            }
          : undefined,
      },
    });

    const homoGroup = { ...data } as HomoGroupEntity;

    if (data.hierarchyOnHomogeneous)
      homoGroup.hierarchies = data.hierarchyOnHomogeneous.map((homo) => ({
        ...homo.hierarchy,
        workspaceId: homo.workspaceId,
      }));

    return this.getHomoGroupData(homoGroup);
  }

  async findHomoGroupByCompanyAndId(id: string, companyId: string) {
    const hierarchies = await this.prisma.homogeneousGroup.findFirst({
      where: { companyId, id },
    });

    return new HomoGroupEntity(hierarchies);
  }

  async findHomoGroupByCompanyAndName(name: string, companyId: string) {
    const hierarchies = await this.prisma.homogeneousGroup.findFirst({
      where: { companyId, name },
    });

    return new HomoGroupEntity(hierarchies);
  }

  async findHomoGroupByCompany(
    companyId: string,
    options: {
      include?: Prisma.HomogeneousGroupInclude;
      where?: Prisma.HomogeneousGroupWhereInput;
    } = {},
  ) {
    const hierarchies = await this.prisma.homogeneousGroup.findMany({
      where: { companyId, ...options.where },
      include: {
        hierarchyOnHomogeneous: { include: { hierarchy: true } },
        ...options.include,
      },
    });

    const homogeneousGroup = await Promise.all(
      hierarchies.map(async (homoGroup) => {
        return await this.getHomoGroupData(homoGroup);
      }),
    );

    return homogeneousGroup;
  }

  private async getHomoGroupData(homoGroup: HomoGroupEntity) {
    const homogeneousGroup = { ...homoGroup } as HomoGroupEntity;
    const companyId = homoGroup.companyId;
    const workplacesIds = new Set<string>();

    if (homoGroup.hierarchyOnHomogeneous)
      homogeneousGroup.hierarchies = homoGroup.hierarchyOnHomogeneous.map(
        (homo) => {
          workplacesIds.add(homo.workspaceId);
          return {
            ...homo.hierarchy,
            workspaceId: homo.workspaceId,
          };
        },
      );

    homogeneousGroup.workspaceIds = Array.from(workplacesIds);

    const hierarchiesIds = homogeneousGroup.hierarchies
      ? removeDuplicate(homogeneousGroup.hierarchies.map((h) => h.id))
      : [];

    const where = {
      companyId,
      workspaces: {
        some: {
          OR: homogeneousGroup.workspaceIds.map((workspaceId) => ({
            id: workspaceId,
          })),
        },
      },
    };

    const AllChildrenHierarchies = await this.prisma.hierarchy.findMany({
      where: { parentId: { in: hierarchiesIds }, ...where },
      include: {
        children: {
          where,
          include: {
            children: {
              where,
              include: {
                children: {
                  where,
                  include: {
                    children: {
                      where,
                      include: {
                        children: {
                          include: { children: true },
                          where,
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
    });

    const getAllHierarchiesChildren = async (
      hierarchies: HierarchyEntity[],
    ) => {
      hierarchies.forEach((hierarchy) => {
        hierarchiesIds.push(hierarchy.id);

        if (hierarchy.children) getAllHierarchiesChildren(hierarchy.children);
      });
    };

    await getAllHierarchiesChildren(AllChildrenHierarchies);

    homogeneousGroup.employeeCount = await this.prisma.employee.count({
      where: {
        companyId,
        hierarchyId: {
          in: hierarchiesIds,
        },
      },
    });

    return new HomoGroupEntity(homogeneousGroup);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.homogeneousGroup.delete({
      where: { id },
    });
  }
}
