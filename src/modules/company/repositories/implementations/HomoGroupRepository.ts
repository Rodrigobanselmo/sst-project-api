import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';
import { CreateHomoGroupDto, FindHomogeneousGroupDto, UpdateHierarchyHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { sortData } from './../../../../shared/utils/sorts/data.sort';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class HomoGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create({ hierarchies, endDate = null, startDate = null, ...createHomoGroupDto }: CreateHomoGroupDto, companyId: string): Promise<HomoGroupEntity> {
    const data = await this.prisma.homogeneousGroup.create({
      data: {
        ...createHomoGroupDto,
        companyId,
      },
    });

    if (hierarchies) {
      await Promise.all(
        hierarchies.map(
          async ({ id: hierarchyId, workspaceId }) =>
            await this.prisma.hierarchyOnHomogeneous.create({
              data: {
                hierarchyId,
                workspaceId,
                homogeneousGroupId: data.id,
                startDate,
                endDate,
              },
            }),
        ),
      );
    }

    return this.getHomoGroupData(data);
  }

  async update({ id, hierarchies, endDate = null, startDate = null, ...updateHomoGroup }: UpdateHomoGroupDto): Promise<HomoGroupEntity> {
    if (hierarchies) {
      const hierarchyOnHomogeneous = {};
      const foundHomogeneousGroups = await this.prisma.hierarchyOnHomogeneous.findMany({
        where: {
          homogeneousGroupId: id,
          hierarchyId: { in: hierarchies.map((h) => h.id) },
        },
      });

      foundHomogeneousGroups
        .sort((a, b) => sortData(b?.endDate || new Date('3000-01-01T00:00:00.00Z'), a?.endDate || new Date('3000-01-01T00:00:00.00Z')))
        .forEach((hg) => {
          if (hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId]) return;

          if (!hg.startDate && !hg.endDate) {
            hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};
            hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id;
            return;
          }

          if (endDate && !startDate) {
            if (hg.startDate && !hg.endDate && hg.startDate < endDate) {
              hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};

              hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id;

              hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].startDate = undefined;
              return;
            }
          }

          const sameDate = hg.startDate == startDate || hg.endDate == endDate;
          if (sameDate) {
            hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId] = {};
            return (hierarchyOnHomogeneous[hg.hierarchyId + hg.workspaceId].id = hg.id);
          }

          //!
          // if (startDate && !endDate) {
          //   const max = foundHomogeneousGroups.reduce((a, b) => {
          //     if (hg.hierarchyId !== b.hierarchyId) return a;
          //     return Math.max(a, b?.endDate?.getTime());
          //   }, 0);

          //   if (hg.endDate?.getTime() == max) {
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId] = {};
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId].id = hg.id;
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId].endDate = undefined;
          //   }
          // }

          // if (endDate && !startDate) {
          //   const min = foundHomogeneousGroups.reduce((a, b) => {
          //     if (hg.hierarchyId !== b.hierarchyId) return a;
          //     return a
          //       ? Math.max(a, b?.startDate?.getTime())
          //       : b?.startDate?.getTime() || 0;
          //   }, 0);

          //   if ((hg?.startDate?.getTime() || 0) == min) {
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId] = {};
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId].id = hg.id;
          //     hierarchyOnHomogeneous[hg.hierarchyId+hg.workspaceId].startDate = undefined;
          //   }
          // }
          //!
        });

      await Promise.all(
        hierarchies.map(
          async ({ id: hierarchyId, workspaceId }) =>
            await this.prisma.hierarchyOnHomogeneous.upsert({
              where: {
                id: hierarchyOnHomogeneous[hierarchyId + workspaceId]?.id || 0,
              },
              create: {
                hierarchyId,
                workspaceId,
                homogeneousGroupId: id,
                startDate,
                endDate,
              },
              update: {
                startDate:
                  hierarchyOnHomogeneous[hierarchyId + workspaceId] && 'startDate' in hierarchyOnHomogeneous[hierarchyId + workspaceId]
                    ? hierarchyOnHomogeneous[hierarchyId + workspaceId].startDate
                    : startDate,
                endDate:
                  hierarchyOnHomogeneous[hierarchyId + workspaceId] && 'endDate' in hierarchyOnHomogeneous[hierarchyId + workspaceId]
                    ? hierarchyOnHomogeneous[hierarchyId + workspaceId].endDate
                    : endDate,
              },
            }),
        ),
      );
    }

    const data = await this.prisma.homogeneousGroup.update({
      where: { id },
      include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
      data: {
        ...updateHomoGroup,
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

  async updateHierarchyHomo({ ids, workspaceId, endDate = null, startDate = null }: UpdateHierarchyHomoGroupDto) {
    return this.prisma.hierarchyOnHomogeneous.updateMany({
      where: { id: { in: ids }, workspaceId },
      data: {
        startDate,
        endDate,
      },
    });
  }

  async deleteHierarchyHomo({ ids, workspaceId }: UpdateHierarchyHomoGroupDto) {
    return this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { id: { in: ids }, workspaceId },
    });
  }

  async findHomoGroupByCompanyAndId(id: string, companyId: string, options?: Prisma.HomogeneousGroupFindFirstArgs) {
    const homo = await this.prisma.homogeneousGroup.findFirst({
      where: { companyId, id },
      ...options,
    });

    return new HomoGroupEntity(homo);
  }

  async find(query: Partial<FindHomogeneousGroupDto>, pagination: PaginationQueryDto, options: Prisma.HomogeneousGroupFindManyArgs = {}) {
    const whereInit = {
      AND: [],
      type: null,
      ...options.where,
    } as typeof options.where;

    options.orderBy = {
      name: 'asc',
    };

    options.select = {
      id: true,
      name: true,
      companyId: true,
      status: true,
      type: true,
      ...options?.select,
    };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'type'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        name: { contains: query.search, mode: 'insensitive' },
      } as typeof options.where);
    }
    if ('type' in query) {
      (where.type as any).type = { in: query.type };
    }

    const response = await this.prisma.$transaction([
      this.prisma.homogeneousGroup.count({
        where,
      }),
      this.prisma.homogeneousGroup.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        where,
      }),
    ]);

    return {
      data: response[1].map((employee) => new HomoGroupEntity(employee)),
      count: response[0],
    };
  }

  async findFirstNude(options?: Prisma.HomogeneousGroupFindFirstArgs) {
    const homo = await this.prisma.homogeneousGroup.findFirst({
      ...options,
    });

    return new HomoGroupEntity(homo);
  }

  async findById(id: string, companyId: string, options?: Prisma.HomogeneousGroupFindFirstArgs) {
    const homo = await this.prisma.homogeneousGroup.findFirst({
      where: { id, companyId },
      include: {
        hierarchyOnHomogeneous: {
          include: {
            hierarchy: {
              select: {
                id: true,
                name: true,
                type: true,
                workspaces: { select: { id: true } },
              },
            },
          },
        },
      },
      ...options,
    });

    return new HomoGroupEntity(homo);
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
      homogeneousGroup.hierarchies = homoGroup.hierarchyOnHomogeneous.map((homo) => {
        workplacesIds.add(homo.workspaceId);
        return {
          ...homo.hierarchy,
          workspaceId: homo.workspaceId,
        };
      });

    homogeneousGroup.workspaceIds = Array.from(workplacesIds);

    const hierarchiesIds = homogeneousGroup.hierarchies ? removeDuplicate(homogeneousGroup.hierarchies.map((h) => h.id)) : [];

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

    const getAllHierarchiesChildren = async (hierarchies: HierarchyEntity[]) => {
      hierarchies.forEach((hierarchy) => {
        hierarchiesIds.push(hierarchy.id);

        if (hierarchy.children) getAllHierarchiesChildren(hierarchy.children);
      });
    };

    await getAllHierarchiesChildren(AllChildrenHierarchies);

    //only need this data on modal, can query only once
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
    await this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { homogeneousGroupId: id },
    });

    await this.prisma.riskFactorData.deleteMany({
      where: { homogeneousGroupId: id },
    });

    await this.prisma.homogeneousGroup.delete({
      where: { id },
    });
  }
}
