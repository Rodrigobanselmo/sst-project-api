/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';
import { asyncEach } from '../../../../shared/utils/asyncEach';

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

    return new HomoGroupEntity(data);
  }

  async update({
    id,
    hierarchies = [],
    ...updateHomoGroup
  }: UpdateHomoGroupDto): Promise<HomoGroupEntity> {
    const homoHierarchies = hierarchies.map((hierarchy) => ({
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

    return new HomoGroupEntity(homoGroup);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.homogeneousGroup.delete({
      where: { id },
    });
  }

  async findHomoGroupByCompanyAndId(id: string, companyId: string) {
    const hierarchies = await this.prisma.homogeneousGroup.findFirst({
      where: { companyId, id },
    });

    return new HomoGroupEntity(hierarchies);
  }

  async findHomoGroupByCompany(companyId: string) {
    const hierarchies = await this.prisma.homogeneousGroup.findMany({
      where: { companyId },
      include: { hierarchyOnHomogeneous: { include: { hierarchy: true } } },
    });

    return hierarchies.map((homoGroup) => {
      const homogeneousGroup = { ...homoGroup } as HomoGroupEntity;
      if (homoGroup.hierarchyOnHomogeneous)
        homogeneousGroup.hierarchies = homoGroup.hierarchyOnHomogeneous.map(
          (homo) => ({
            ...homo.hierarchy,
            workspaceId: homo.workspaceId,
          }),
        );

      return new HomoGroupEntity(homogeneousGroup);
    });
  }
}
