import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';

interface ICompanyEnvironment extends UpsertEnvironmentDto {
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
    hierarchyIds,
    ...environmentDto
  }: ICompanyEnvironment): Promise<EnvironmentEntity> {
    const environment = await this.prisma.companyEnvironment.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...environmentDto,
        companyId,
        workspaceId,
        name: environmentDto.name,
        type: environmentDto.type,
        hierarchy: { connect: hierarchyIds.map((id) => ({ id })) },
      },
      update: {
        ...environmentDto,
        hierarchy: { set: hierarchyIds.map((id) => ({ id })) },
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

  async delete(id: string, companyId: string, workspaceId: string) {
    const environment = await this.prisma.companyEnvironment.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new EnvironmentEntity(environment);
  }
}