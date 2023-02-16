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
import { isEnvironment } from './CharacterizationRepository';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class HomoGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create({ workspaceIds, hierarchies, endDate = null, startDate = null, ...createHomoGroupDto }: CreateHomoGroupDto, companyId: string): Promise<HomoGroupEntity> {
    const data = await this.prisma.homogeneousGroup.create({
      data: {
        ...createHomoGroupDto,
        companyId,
        ...(workspaceIds?.length && { workspaces: { connect: workspaceIds.map((id) => ({ id_companyId: { id, companyId } })) } }),
      },
    });

    if (hierarchies) {
      await Promise.all(
        hierarchies.map(
          async ({ id: hierarchyId }) =>
            await this.prisma.hierarchyOnHomogeneous.create({
              data: {
                hierarchyId,
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

  async update({ workspaceIds, companyId, id, hierarchies, endDate = null, startDate = null, ...updateHomoGroup }: UpdateHomoGroupDto): Promise<HomoGroupEntity> {
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
          if (hierarchyOnHomogeneous[hg.hierarchyId]) return;

          if (!hg.startDate && !hg.endDate) {
            hierarchyOnHomogeneous[hg.hierarchyId] = {};
            hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;
            return;
          }

          if (endDate && !startDate) {
            if (hg.startDate && !hg.endDate && hg.startDate < endDate) {
              hierarchyOnHomogeneous[hg.hierarchyId] = {};

              hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id;

              hierarchyOnHomogeneous[hg.hierarchyId].startDate = undefined;
              return;
            }
          }

          const sameDate = hg.startDate == startDate || hg.endDate == endDate;
          if (sameDate) {
            hierarchyOnHomogeneous[hg.hierarchyId] = {};
            return (hierarchyOnHomogeneous[hg.hierarchyId].id = hg.id);
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
          async ({ id: hierarchyId }) =>
            await this.prisma.hierarchyOnHomogeneous.upsert({
              where: {
                id: hierarchyOnHomogeneous[hierarchyId]?.id || 0,
              },
              create: {
                hierarchyId,
                homogeneousGroupId: id,
                startDate,
                endDate,
              },
              update: {
                startDate:
                  hierarchyOnHomogeneous[hierarchyId] && 'startDate' in hierarchyOnHomogeneous[hierarchyId] ? hierarchyOnHomogeneous[hierarchyId].startDate : startDate,
                endDate: hierarchyOnHomogeneous[hierarchyId] && 'endDate' in hierarchyOnHomogeneous[hierarchyId] ? hierarchyOnHomogeneous[hierarchyId].endDate : endDate,
              },
            }),
        ),
      );
    }

    const data = await this.prisma.homogeneousGroup.update({
      where: { id },
      include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
      data: {
        ...(workspaceIds?.length && { workspaces: { connect: workspaceIds.map((id) => ({ id_companyId: { id, companyId } })) } }),
        ...updateHomoGroup,
      },
    });

    const homoGroup = { ...data } as HomoGroupEntity;

    if (data.hierarchyOnHomogeneous)
      homoGroup.hierarchies = data.hierarchyOnHomogeneous.map((homo) => ({
        ...homo.hierarchy,
      }));

    return this.getHomoGroupData(homoGroup);
  }

  async updateHierarchyHomo({ ids, endDate = null, startDate = null }: UpdateHierarchyHomoGroupDto) {
    return this.prisma.hierarchyOnHomogeneous.updateMany({
      where: { id: { in: ids } },
      data: {
        startDate,
        endDate,
      },
    });
  }

  async deleteHierarchyHomo({ ids }: UpdateHierarchyHomoGroupDto) {
    return this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { id: { in: ids } },
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
    const select = {
      id: true,
      name: true,
      type: true,
    };

    const homo = await this.prisma.homogeneousGroup.findFirst({
      where: { id, companyId },
      include: {
        workspaces: { select: { id: true } },
        hierarchyOnHomogeneous: {
          include: {
            hierarchy: {
              select: {
                workspaces: { select: { id: true } },
                ...select,
                parent: {
                  select: {
                    ...select,
                    parent: {
                      select: {
                        ...select,
                        parent: {
                          select: {
                            ...select,
                            parent: {
                              select: {
                                ...select,
                                parent: {
                                  select: {
                                    ...select,
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
          },
        },
      },
      ...options,
    });

    return new HomoGroupEntity(homo as any);
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
    const homo = await this.prisma.homogeneousGroup.findMany({
      where: { companyId, status: 'ACTIVE', ...options.where },
      include: {
        workspaces: { select: { id: true } },
        hierarchyOnHomogeneous: { include: { hierarchy: true } },
        ...options.include,
      },
    });

    const homogeneousGroup = await Promise.all(
      homo.map(async (homoGroup) => {
        return await this.getHomoGroupData(homoGroup as any);
      }),
    );

    return homogeneousGroup;
  }

  async findDocumentData(companyId: string, options?: { workspaceId?: string }) {
    const homogeneousGroups = await this.prisma.homogeneousGroup.findMany({
      where: { companyId, ...(options.workspaceId && { workspaces: { some: { id: options.workspaceId } } }) },
      include: { characterization: { include: { photos: true, profiles: true } } },
    });

    return homogeneousGroups.map((homo) => new HomoGroupEntity(homo));
  }

  private async getHomoGroupData(homoGroup: HomoGroupEntity) {
    const homogeneousGroup = { ...homoGroup } as HomoGroupEntity;
    const companyId = homoGroup.companyId;

    if (homoGroup.hierarchyOnHomogeneous)
      homogeneousGroup.hierarchies = homoGroup.hierarchyOnHomogeneous.map((homo) => {
        return {
          ...homo.hierarchy,
        };
      });

    const hierarchiesIds = homogeneousGroup.hierarchies ? removeDuplicate(homogeneousGroup.hierarchies.map((h) => h.id)) : [];

    const where = {
      companyId,
    };

    const select = {
      id: true,
      name: true,
      parentId: true,
      type: true,
    };

    const AllChildrenHierarchies = await this.prisma.hierarchy.findMany({
      where: { parentId: { in: hierarchiesIds }, ...where },
      select: {
        ...select,
        children: {
          where,
          select: {
            ...select,
            children: {
              where,
              select: {
                ...select,
                children: {
                  where,
                  select: {
                    ...select,
                    children: {
                      where,
                      select: {
                        ...select,
                        children: {
                          select: { ...select },
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

    await getAllHierarchiesChildren(AllChildrenHierarchies as any);

    //only need this data on modal, can query only once
    //! optimze here, only get employeecount when opening modal
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
