import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';

interface ICompanyEnvironment extends Omit<UpsertEnvironmentDto, 'photos'> {
  companyId: string;
  workspaceId: string;
}

@Injectable()
export class EnvironmentRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    companyId,
    workspaceId,
    hierarchyIds = [],
    ...environmentDto
  }: ICompanyEnvironment): Promise<EnvironmentEntity> {
    const newId = v4();

    const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
      where: { id: id || 'no-id' },
      create: {
        id: newId,
        name: newId,
        //! optimization here nd on characterization
        description: environmentDto.name + '(//)' + environmentDto.type,
        companyId: companyId,
        type: HomoTypeEnum.ENVIRONMENT,
      },
      update: {
        description: environmentDto.name + '(//)' + environmentDto.type,
      },
    });

    await this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { homogeneousGroupId: homogeneousGroup.id },
    });

    await Promise.all(
      hierarchyIds.map(
        async (hierarchyId) =>
          await this.prisma.hierarchyOnHomogeneous.upsert({
            where: {
              hierarchyId_homogeneousGroupId_workspaceId: {
                hierarchyId,
                workspaceId,
                homogeneousGroupId: homogeneousGroup.id,
              },
            },
            create: {
              hierarchyId,
              workspaceId,
              homogeneousGroupId: homogeneousGroup.id,
            },
            update: {},
          }),
      ),
    );

    const environment = await this.prisma.companyEnvironment.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...environmentDto,
        id: newId,
        companyId,
        workspaceId,
        name: environmentDto.name,
        type: environmentDto.type,
      },
      update: {
        ...environmentDto,
      },
    });

    return new EnvironmentEntity(environment);
  }

  async findAll(
    companyId: string,
    workspaceId: string,
    options?: Prisma.CompanyEnvironmentFindManyArgs,
  ) {
    const environment = await this.prisma.companyEnvironment.findMany({
      where: { workspaceId, companyId },
      ...options,
    });

    return [...environment.map((env) => new EnvironmentEntity(env))];
  }

  async findById(id: string) {
    const environment = await this.prisma.companyEnvironment.findUnique({
      where: { id },
      include: { photos: true },
    });

    return new EnvironmentEntity(environment);
  }

  async delete(id: string, companyId: string, workspaceId: string) {
    const environment = await this.prisma.companyEnvironment.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new EnvironmentEntity(environment);
  }
}
