/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';

@Injectable()
export class HomoGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    { hierarchies, ...updateHomoGroup }: CreateHomoGroupDto,
    companyId: string,
  ): Promise<HomoGroupEntity> {
    const data = await this.prisma.homogeneousGroup.create({
      data: {
        ...updateHomoGroup,
        companyId,
      },
    });

    if (hierarchies && hierarchies.length)
      await this.prisma.homogeneousGroup.update({
        data: {
          hierarchies: {
            set: hierarchies.map((id) => ({ id })),
          },
        },
        where: { id: data.id },
      });

    return new HomoGroupEntity(data);
  }

  async update({
    id,
    hierarchies,
    ...updateHomoGroup
  }: UpdateHomoGroupDto): Promise<HomoGroupEntity> {
    const data = await this.prisma.homogeneousGroup.update({
      where: { id },
      include: { hierarchies: true },
      data: {
        ...updateHomoGroup,
        hierarchies: hierarchies
          ? { set: hierarchies.map((id) => ({ id })) }
          : undefined,
      },
    });

    return new HomoGroupEntity(data);
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
      include: { hierarchies: true },
    });

    return hierarchies.map((homoGroup) => new HomoGroupEntity(homoGroup));
  }
}
